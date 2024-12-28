import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async register(registerDto: RegisterRequestDto) {
    // Destructure fields
    const { email, password } = registerDto;

    // Ensure there is no user with such email
    const userExists = await this.usersService.findByEmail(email);
    if (userExists) {
      // Throw a new error with a status code 409
      throw new HttpException(
        'This email is already registered',
        HttpStatus.CONFLICT,
      );
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

  async login(user: User) {
    const payload = { sub: user.id, username: user.name };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '2h',
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    const updatedUser = await this.usersService.updateTokens({
      email: user.email,
      access_token,
      refresh_token,
    });

    // Ensure user was created
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return updatedUser;
  }

  async logout(id: number) {
    await this.usersService.setFieldToNull(id, 'access_token');
    return { message: 'Logout successful' };
  }

  async me(id: number) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return null;
      }

      const { password_hash: _, ...result } = user;
      return result;
    }

    return null;
  }
}
