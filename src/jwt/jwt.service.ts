import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: NestJwtService,
  ) {}

  async signToken(payload: any, expiresIn: string) {
    return this.jwtService.signAsync(payload, {
      expiresIn: expiresIn,
    });
  }

  // Method to sign an access token
  async signAccessToken(payload: { sub: number; username: string }) {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
    });
  }

  // Method to sign a refresh token
  async signRefreshToken(payload: { sub: number; username: string }) {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });
  }

  // Method to decode a token
  decodeToken(token: string) {
    return this.jwtService.decode(token);
  }

  /**
   * Decodes and verifies a JWT token.
   *
   * @param token - The JWT token to decode and verify.
   * @returns The email address extracted from the token payload if valid.
   * @throws BadRequestException if the token is invalid or does not contain an email.
   */
  async decodeVerificationToken(token: string) {
    try {
      // Verify the token using the JWT service and the secret key from the configuration.
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Check if the payload is an object and contains the 'email' field.
      if (typeof payload === 'object' && 'email' in payload) {
        // Return the email address from the token payload.
        return payload.email as string;
      }

      // Throw an exception if the token is invalid or does not contain an email field.
      throw new BadRequestException('Invalid token');
    } catch (error) {
      // If token is expired, throw error
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Reset password token expired');
      }

      // In all other cases throw this error
      throw new BadRequestException('Invalid token');
    }
  }
}
