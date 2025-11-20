import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
}

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(userId, email),
      this.generateRefreshToken(userId, email),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(
    userId: string,
    email: string,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
      type: 'access' as const,
    };

    const secret = this.configService.get<string>('jwt.secret') || 'default-secret-key';
    const expiresIn = this.configService.get<string>('jwt.accessTokenExpiry') || '15m';

    return this.jwtService.signAsync(payload as any, {
      secret,
      expiresIn: expiresIn as any,
    });
  }

  private async generateRefreshToken(
    userId: string,
    email: string,
  ): Promise<string> {
    const payload = {
      sub: userId,
      email,
      type: 'refresh' as const,
    };

    const secret = this.configService.get<string>('jwt.secret') || 'default-secret-key';
    const expiresIn = this.configService.get<string>('jwt.refreshTokenExpiry') || '7d';

    return this.jwtService.signAsync(payload as any, {
      secret,
      expiresIn: expiresIn as any,
    });
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    const secret = this.configService.get<string>('jwt.secret') || 'default-secret-key';
    
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret,
    });
  }
}

