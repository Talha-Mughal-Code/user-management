import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthService, JwtPayload } from './jwt.service';

describe('JwtAuthService', () => {
  let service: JwtAuthService;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockJwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          'jwt.secret': 'test-secret-key',
          'jwt.accessTokenExpiry': '15m',
          'jwt.refreshTokenExpiry': '7d',
        };
        return config[key] || 'default-value';
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<JwtAuthService>(JwtAuthService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateTokens', () => {
    const userId = '507f1f77bcf86cd799439011';
    const email = 'test@example.com';

    it('should generate access and refresh tokens', async () => {
      jwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.generateTokens(userId, email);

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: userId,
          email,
          type: 'access',
        }),
        expect.objectContaining({
          secret: 'test-secret-key',
          expiresIn: '15m',
        }),
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: userId,
          email,
          type: 'refresh',
        }),
        expect.objectContaining({
          secret: 'test-secret-key',
          expiresIn: '7d',
        }),
      );
    });
  });

  describe('verifyToken', () => {
    const token = 'test-token';
    const mockPayload: JwtPayload = {
      sub: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      type: 'access',
    };

    it('should verify token successfully', async () => {
      jwtService.verifyAsync.mockResolvedValue(mockPayload);

      const result = await service.verifyToken(token);

      expect(result).toEqual(mockPayload);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: 'test-secret-key',
      });
    });

    it('should throw error if token is invalid', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(service.verifyToken(token)).rejects.toThrow('Invalid token');
    });
  });
});

