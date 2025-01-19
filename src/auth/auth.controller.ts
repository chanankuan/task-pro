import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  ChangePasswordDto,
  changePasswordSchema,
  loginSchema,
  RegisterRequestDto,
  registerSchema,
  ResetPasswordDto,
  resetPasswordSchema,
} from './dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Request } from 'express';
import { Payload } from './interfaces';
import { User } from 'src/users/entity/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {
  ResendVerificationEmailDto,
  resendVerificationEmailSchema,
} from './dto/resend-verification-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // SIGN UP
  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() registerDto: RegisterRequestDto) {
    const user = await this.authService.register(registerDto);

    return {
      status: 'success',
      payload: { name: user.name, email: user.email },
      message: 'An email verification was send',
    };
  }

  // SIGN IN
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Req() req: Request) {
    const user = await this.authService.login(req.user as User);

    return {
      status: 'success',
      payload: {
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        user: {
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          theme: user.theme,
        },
      },
      message: 'Login successful',
    };
  }

  // SIGN OUT
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const { userId } = req.user as Payload;

    await this.authService.logout(userId);

    return {
      status: 'success',
      data: null,
      message: 'Logout successful',
    };
  }

  // GET ME
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    const { userId } = req.user as Payload;

    const me = await this.authService.me(userId);

    return {
      status: 'success',
      payload: {
        name: me.name,
        email: me.email,
        avatarUrl: me.avatarUrl,
        theme: me.theme,
      },
      message: null,
    };
  }

  // REFRESH ACCESS TOKEN
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(@Req() req: Request) {
    const [bearer, refreshToken] = req.headers.authorization!.split(' ');

    if (bearer !== 'Bearer') {
      throw new UnauthorizedException();
    }

    const accessToken = await this.authService.refreshToken(refreshToken);

    return {
      status: 'success',
      payload: { accessToken: accessToken },
      message: null,
    };
  }

  // CHANGE PASSWORD
  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async updatePassword(
    @Req() req: Request,
    @Body(new ZodValidationPipe(changePasswordSchema))
    changePasswordDto: ChangePasswordDto,
  ) {
    const { userId } = req.user as Payload;
    await this.authService.changePassword(userId, changePasswordDto);

    return {
      status: 'success',
      payload: null,
      message: 'Password changed successfully',
    };
  }

  // VERIFY EMAIL
  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  async verifyEmail(@Query('token') token: string) {
    await this.authService.verifyEmail(token);

    return {
      status: 'success',
      payload: null,
      message: 'Email is verified',
    };
  }

  // RESEND CONFIRMATION EMAIL
  @HttpCode(HttpStatus.OK)
  @Post('resend-verification-email')
  async sendVerificationEmail(
    @Body(new ZodValidationPipe(resendVerificationEmailSchema))
    resendVerificationEmailDto: ResendVerificationEmailDto,
  ) {
    await this.authService.sendVerificationEmail(
      resendVerificationEmailDto.email,
    );

    return {
      status: 'success',
      payload: null,
      message: 'Email was sent successfully',
    };
  }

  // REQUEST PASSWORD RESET
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);

    return {
      status: 'success',
      payload: null,
      message: 'Password request was sent on email',
    };
  }

  // PASSWORD RESET
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(
    @Body(new ZodValidationPipe(resetPasswordSchema))
    resetPasswordDto: ResetPasswordDto,
  ) {
    await this.authService.resetPassword(resetPasswordDto);

    return {
      status: 'success',
      payload: null,
      message: 'Password was reset',
    };
  }
}
