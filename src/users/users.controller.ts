import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Request } from 'express';
import {
  ChangeThemeDto,
  changeThemeSchema,
  UpdateProfileDto,
  updateProfileSchema,
} from './dto';
import { ZodValidationPipe } from 'src/common/pipes';
import { Payload } from 'src/auth/interfaces';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('update-avatar')
  updateAvatar() {
    return this.usersService.updateAvatar();
  }

  @Patch('update-profile')
  async updateProfile(
    @Req() req: Request,
    @Body(new ZodValidationPipe(updateProfileSchema))
    updateProfileDto: UpdateProfileDto,
  ) {
    const { userId } = req.user as Payload;

    const user = await this.usersService.updateProfile(
      userId,
      updateProfileDto,
    );

    return {
      status: 'success',
      payload: {
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        theme: user.theme,
      },
      message: 'Profile updated successfully',
    };
  }

  @Patch('change-theme')
  async changeTheme(
    @Req() req: Request,
    @Body(new ZodValidationPipe(changeThemeSchema))
    changeThemeDto: ChangeThemeDto,
  ) {
    const { userId } = req.user as Payload;

    const user = await this.usersService.changeTheme(userId, changeThemeDto);

    return {
      status: 'success',
      payload: {
        theme: user.theme,
      },
      message: 'Theme changed successfully',
    };
  }

  @Post('help')
  help() {
    return this.usersService.help();
  }

  @Delete('delete-user')
  deleteUser() {
    return this.usersService.deleteUser();
  }
}
