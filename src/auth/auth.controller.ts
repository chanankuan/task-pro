import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { loginSchema, RegisterRequestDto, registerSchema } from './dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { User } from 'src/users/entity/user.entity';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() registerDto: RegisterRequestDto) {
    const user = await this.authService.register(registerDto);

    return { name: user.name, email: user.email };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Req() req: { user: User }) {
    const user = await this.authService.login(req.user);
    return {
      access_token: user.access_token,
      refresh_token: user.refresh_token,
      user: {
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        theme: user.theme,
      },
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const { id } = req.user as Pick<User, 'id' | 'name'>;

    return await this.authService.logout(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    const { id } = req.user as Pick<User, 'id' | 'name'>;
    const me = await this.authService.me(id);

    return {
      name: me.name,
      email: me.email,
      avatar_url: me.avatar_url,
      theme: me.theme,
    };
  }
}
