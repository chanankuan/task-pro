import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterRequestDto } from 'src/auth/dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
    user.password_hash = registerDto.password;

    // save the new user
    await this.usersRepository.save(user);

    const newUser = await this.findByEmail(user.email);
    return newUser;
  }

  async updateTokens({
    email,
    access_token,
    refresh_token,
  }: Pick<User, 'email' | 'access_token' | 'refresh_token'>) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    user.access_token = access_token;
    user.refresh_token = refresh_token;

    await this.usersRepository.save(user);

    const updatedUser = await this.findByEmail(email);
    return updatedUser;
  }

  async setFieldToNull(id: number, fieldName: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    await this.usersRepository.update(id, { [fieldName]: null });
  }

  updateAvatar() {
    return "This will update user's avatar";
  }

  updateProfile() {
    return "This will update user's profile data";
  }

  changeTheme() {
    return 'This will update theme';
  }

  help() {
    return 'This will send an email to support team';
  }

  deleteUser() {
    return 'This will delete user profile';
  }
}
