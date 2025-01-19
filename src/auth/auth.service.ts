import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto, RegisterRequestDto, ResetPasswordDto } from './dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entity/user.entity';
import { MailerService } from 'src/mailer/mailer.service';
import {
  ForgotPasswordContext,
  VerificationEmailContext,
  WelcomeMessageContext,
} from 'src/templates/interfaces';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    // Inject the JwtService
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private usersService: UsersService,
  ) {}

  // SIGN UP
  async register(registerDto: RegisterRequestDto) {
    // Destructure fields
    const { email, password } = registerDto;

    // Ensure there is no user with such email
    const userExists = await this.usersService.findByEmail(email);
    if (userExists) {
      // Throw a new conflict exception
      throw new ConflictException('This email is already registered');
    }

    // Generate hash
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    // Insert user
    const user = await this.usersService.create({
      ...registerDto,
      password: hash,
    });

    // Send verificaiton email
    await this.sendVerificationEmail(user.email);

    return user;
  }

  // SIGN IN
  async login(user: User) {
    const payload = { sub: user.id, username: user.name };

    const accessToken = await this.jwtService.signAccessToken(payload);
    const refreshToken = await this.jwtService.signRefreshToken(payload);

    const updatedUser = await this.usersService.assignTokens({
      id: user.id,
      accessToken,
      refreshToken,
    });

    // Do not return password
    const { passwordHash: _, ...result } = updatedUser;
    return result;
  }

  // SIGN OUT
  async logout(userId: number) {
    await this.usersService.removeTokens(userId);
    return { message: 'Logout successful' };
  }

  // GET ME
  async me(userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  // REFRESH ACCESS TOKEN
  async refreshToken(token: string) {
    const { sub: userId, username } = await this.jwtService.decodeToken(token);

    // Find the current user
    const user = await this.usersService.findById(userId);

    // Ensure user exists and refresh token matches
    if (user && user.refreshToken === token) {
      // Sign a new access token
      const accessToken = await this.jwtService.signAccessToken({
        sub: userId,
        username: username,
      });

      // Assign the newly created access token, keeping the refresh token the same
      await this.usersService.assignTokens({
        id: userId,
        accessToken: accessToken,
        refreshToken: user.refreshToken,
      });

      return accessToken;
    }

    // User does not exist or refresh token does not match,
    // throw unauthorized exception
    throw new UnauthorizedException();
  }

  // CHANGE PASSWORD
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    // Ensure user with such email exist
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Ensure user do not provide the same password
    if (changePasswordDto.oldPassword === changePasswordDto.password) {
      throw new BadRequestException('New password must be different from old');
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new BadRequestException('Incorrect password');
    }

    // Generate hash
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(changePasswordDto.password, saltOrRounds);

    // Update user password
    await this.usersService.updatePassword(user.id, hash);
  }

  // SEND VERIFICATION EMAIL
  async sendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Issue a verification token
    const verificationToken = await this.jwtService.signToken(
      {
        email: email,
      },
      '1d',
    );

    // Insert tokens into database
    await this.usersService.updateVerificationToken(user.id, verificationToken);

    const frontendBaseUrl = this.configService.get<string>('FRONTEND_BASE_URL');
    const verificationLink = `${frontendBaseUrl}/auth/confirm?token=${verificationToken}`;

    // Add context
    const context: VerificationEmailContext = {
      userName: user.name,
      confirmationLink: verificationLink,
      privacyPolicyLink:
        this.configService.get<string>('FRONTEND_BASE_URL') ?? '',
      supportLink: this.configService.get<string>('FRONTEND_BASE_URL') ?? '',
      year: new Date().getFullYear(),
    };

    // Send the email
    await this.mailerService.sendEmail(
      user.email,
      'Confirm Your Email Address',
      'verification-email',
      context,
    );
  }

  // VERIFY EMAIL
  async verifyEmail(token: string) {
    const email = await this.jwtService.decodeVerificationToken(token);

    // Ensure user exists
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    // Ensure account was not confirmed before
    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Ensure token matches
    if (user.verificationToken !== token) {
      throw new BadRequestException('Invalid token');
    }

    // Send a welcoming email
    const context: WelcomeMessageContext = {
      userName: user.name,
      privacyPolicyLink:
        this.configService.get<string>('FRONTEND_BASE_URL') || '',
      supportLink: this.configService.get<string>('FRONTEND_BASE_URL') || '',
      year: new Date().getFullYear(),
    };
    await this.mailerService.sendEmail(
      user.email,
      'Task Pro Welcomes You! Manage Tasks Like a Pro',
      'welcome',
      context,
    );

    // Activate account
    await this.usersService.activateUser(user.id);
  }

  // FORGOT PASSWORD
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    // Ensure user with such email exist
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isVerified) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Issue a token
    const token = await this.jwtService.signToken({ email }, '10m');

    // Insert the token into db
    await this.usersService.updateVerificationToken(user.id, token);

    const frontendBaseUrl = this.configService.get<string>('FRONTEND_BASE_URL');
    const ResetLink = `${frontendBaseUrl}/auth/reset-password?token=${token}`;

    const context: ForgotPasswordContext = {
      userName: user.name,
      resetLink: ResetLink,
      privacyPolicyLink:
        this.configService.get<string>('FRONTEND_BASE_URL') ?? '',
      supportLink: this.configService.get<string>('FRONTEND_BASE_URL') ?? '',
      year: new Date().getFullYear(),
    };

    await this.mailerService.sendEmail(
      user.email,
      'Reset Your Password for Task Pro',
      'forgot-password',
      context,
    );
  }

  // RESET PASSWORD
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Verify and decode token
    const email = await this.jwtService.decodeVerificationToken(
      resetPasswordDto.token,
    );

    // Ensure user with such email exist
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isVerified) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    // Ensure incoming token matches the issued one before
    if (resetPasswordDto.token !== user.verificationToken) {
      throw new Error();
    }

    // Generate hash
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(resetPasswordDto.password, saltOrRounds);

    // Update user password
    await this.usersService.updatePassword(user.id, hash);

    // Remove verification token, remove
    await this.usersService.removeVerificationToken(user.id);

    // If there are any tokens, remove
    if (user.accessToken || user.refreshToken) {
      await this.logout(user.id);
    }
  }

  // USER VALIDATION
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user && user.isVerified) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return null;
      }

      const { passwordHash: _, ...result } = user;
      return result;
    }

    return null;
  }
}
