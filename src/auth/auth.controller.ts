import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { loginSchema, RegisterRequestDto, registerSchema } from './dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Request } from 'express';
import { Payload } from './interfaces';
import { User } from 'src/users/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // SIGN UP
  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() registerDto: RegisterRequestDto) {
    const user = await this.authService.register(registerDto);

    return { name: user.name, email: user.email };
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
}
