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
import { DataSource, Repository } from 'typeorm';
import { RegisterRequestDto } from 'src/auth/dto';
import { ChangeThemeDto, UpdateProfileDto } from './dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryFolders } from 'src/cloudinary/interfaces/CloudinaryFolders.enum';
import { Card } from 'src/cards/entity/card.entity';
import { BoardColumn } from 'src/columns/entity/column.entity';
import { Board } from 'src/boards/entity/board.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly dataSource: DataSource,
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
    const newUser = await this.usersRepository.save(user);
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
    return updatedUser;
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

  // SET VERIFICATION TOKEN
  async updateVerificationToken(userId: number, token: string) {
    await this.usersRepository.update(
      { id: userId },
      { verificationToken: token },
    );
  }

  // REMOVE VERIFICATION TOKEN
  async removeVerificationToken(userId: number) {
    await this.usersRepository.update(
      { id: userId },
      { verificationToken: null },
    );
  }

  // UPDATE PASSWORD
  async updatePassword(userId: number, hash: string) {
    await this.usersRepository.update({ id: userId }, { passwordHash: hash });
  }

  help() {
    return 'This will send an email to support team';
  }

  // ACTIVATE USER ACCOUNT
  async activateUser(userId: number) {
    await this.usersRepository.update({ id: userId }, { isVerified: true });
  }

  // DELETE ACCOUNT
  async deleteUser(userId: number) {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    await this.dataSource.transaction(async (manager) => {
      const currentDate = new Date();

      // Soft delete cards related to the board's columns
      await manager
        .createQueryBuilder()
        .update(Card)
        .set({ deletedAt: currentDate })
        .where(
          `column_id IN (
            SELECT id FROM columns
            WHERE board_id IN (
              SELECT id FROM boards
              WHERE user_id = :userId
            )
          )`,
          { userId },
        )
        .andWhere('deleted_at IS NULL')
        .execute();

      // Soft delete columns related to the board
      await manager
        .createQueryBuilder()
        .update(BoardColumn)
        .set({ deletedAt: currentDate })
        .where('board_id IN (SELECT id FROM boards WHERE user_id = :userId)', {
          userId,
        })
        .andWhere('deleted_at IS NULL')
        .execute();

      // Soft delete the board
      await manager
        .createQueryBuilder()
        .update(Board)
        .set({ deletedAt: currentDate })
        .where('id IN (SELECT id FROM boards WHERE user_id = :userId)', {
          userId,
        })
        .execute();

      // Soft delete the user
      await manager
        .createQueryBuilder()
        .update(User)
        .set({ deletedAt: currentDate })
        .where('id = :userId', { userId })
        .execute();
    });

    return 'This will delete user profile';
  }
}
