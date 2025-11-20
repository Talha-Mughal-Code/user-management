import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserRepository } from './repositories/user.repository';
import { JwtAuthService } from './jwt/jwt.service';
import { LoggerService } from '@core/logger';
import { User } from '@common/entities';
import { getModelToken } from '@nestjs/mongoose';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let service: AuthenticationService;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      existsByEmail: jest.fn(),
    };

    const mockJwtAuthService = {
      generateTokens: jest.fn(),
      verifyToken: jest.fn(),
    };

    const mockLoggerService = {
      setContext: jest.fn(),
      log: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        AuthenticationService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtAuthService,
          useValue: mockJwtAuthService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
