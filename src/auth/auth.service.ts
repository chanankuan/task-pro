import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterRequestDto } from './dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    // Inject the JwtService
    private jwtService: JwtService,
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

    // Ensure user was created
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  // SIGN IN
  async login(user: User) {
    const payload = { sub: user.id, username: user.name };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '2h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    const updatedUser = await this.usersService.assignTokens({
      id: user.id,
      accessToken,
      refreshToken,
    });

    // Ensure user was created
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return updatedUser;
  }

  // SIGN OUT
  async logout(id: number) {
    await this.usersService.setFieldToNull(id, 'accessToken');
    return { message: 'Logout successful' };
  }

  // GET ME
  async me(id: number) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  // REFRESH ACCESS TOKEN
  async refreshToken(token: string) {
    const { sub: userId, username } = await this.jwtService.decode(token);

    // Find the current user
    const user = await this.usersService.findById(userId);

    // Ensure user exists and refresh token matches
    if (user && user.refreshToken === token) {
      // Sign a new access token
      const accessToken = await this.jwtService.signAsync({
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

  // USER VALIDATION
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
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
