import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { Payload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      // Ensure req is passed to callback so we access to it in validate() function
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    // Retrieve the incoming token from headers
    const token = req.headers['authorization'].split(' ')[1];

    // Retieve user's data
    const user = await this.usersService.findById(payload.sub);

    // Ensure the token in payload matches token stored in db and the user account is active
    if (!user || (user && user.accessToken !== token) || user.deletedAt) {
      return null;
    }

    return { userId: payload.sub, name: payload.username } as Payload;
  }
}
