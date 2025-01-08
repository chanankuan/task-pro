import * as fs from 'fs';
import { join } from 'path';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterRequestDto } from 'src/auth/dto';
import { ChangeThemeDto, UpdateProfileDto } from './dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryFolders } from 'src/cloudinary/interfaces/CloudinaryFolders.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async create(registerDto: RegisterRequestDto) {
    // create a new instance of the user
    const user = new User();

    // attach name, email, and hash
    user.name = registerDto.name;
    user.email = registerDto.email;
    user.passwordHash = registerDto.password;

    // save the new user
    await this.usersRepository.save(user);

    const newUser = await this.findByEmail(user.email);
    return newUser;
  }

  async assignTokens({
    id,
    accessToken,
    refreshToken,
  }: Pick<User, 'id' | 'accessToken' | 'refreshToken'>) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    const updatedUser = await this.usersRepository.save(user);

    const { passwordHash: _, ...result } = updatedUser;
    return result;
  }

  async removeTokens(userId: number): Promise<void> {
    const user = await this.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    // Set tokens to null
    user.accessToken = null;
    user.refreshToken = null;

    // Save updates
    await this.usersRepository.save(user);
  }

  async setFieldToNull(id: number, fieldName: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    await this.usersRepository.update(id, { [fieldName]: null });
  }

  async updateAvatar(userId: number, fileName: string) {
    // Ensure user exist
    const user = await this.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.avatarUrl) {
      // Get public id
      // It is the string just before .webp (task_pro/avatars/mrips7h8xqth6rngxwdb)
      // https://res.cloudinary.com/devidwxqr/image/upload/v1736189332/task_pro/avatars/mrips7h8xqth6rngxwdb.webp
      const publicId =
        'task_pro/avatars/' +
        user.avatarUrl.split('/').at(-1)!.split('.webp')[0];

      await this.cloudinaryService.delete(publicId);
    }

    // Path to the file
    const filePath = join(process.cwd(), 'uploads', fileName);

    const avatarUrl = await this.cloudinaryService.upload(
      filePath,
      CloudinaryFolders.AVATAR,
    );

    // Remove the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error removing file: ${err}`);
        return;
      }
    });

    // assign the url
    user.avatarUrl = avatarUrl;

    await this.usersRepository.save(user);

    return user;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.findById(userId);

    // Ensure user exists
    if (!user) {
      throw new NotFoundException(
        `The requested resource with ID '${userId}' was not found`,
      );
    }

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...updateProfileDto,
    });

    return updatedUser;
  }

  async changeTheme(userId: number, changeThemeDto: ChangeThemeDto) {
    const user = await this.findById(userId);

    // Ensure user exists
    if (!user) {
      throw new NotFoundException(
        `The requested resource with ID '${userId}' was not found`,
      );
    }

    const updatedUser = await this.usersRepository.save({
      ...user,
      ...changeThemeDto,
    });

    return updatedUser;
  }

  help() {
    return 'This will send an email to support team';
  }

  deleteUser() {
    return 'This will delete user profile';
  }
}
