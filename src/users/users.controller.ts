import { Controller, Delete, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('update-avatar')
  updateAvatar() {
    return this.usersService.updateAvatar();
  }

  @Patch('profile')
  updateProfile() {
    return this.usersService.updateProfile();
  }

  @Patch('change-theme')
  changeTheme() {
    return this.usersService.changeTheme();
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
