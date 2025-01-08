import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { SharpPipe, ZodValidationPipe } from 'src/common/pipes';
import { Payload } from 'src/auth/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('update-avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (_, file, callback) => {
        // Accept only specific image formats
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async updateAvatar(
    @Req() req: Request,
    @UploadedFile(SharpPipe) fileName: string,
  ) {
    const { userId } = req.user as Payload;

    const user = await this.usersService.updateAvatar(userId, fileName);
    return {
      status: 'success',
      payload: {
        avatarUrl: user.avatarUrl,
      },
      message: 'Avatar updated successfully',
    };
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
