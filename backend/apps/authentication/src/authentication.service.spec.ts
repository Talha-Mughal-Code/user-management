import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UserRepository } from './repositories/user.repository';
import { JwtAuthService } from './jwt/jwt.service';
import { LoggerService } from '@core/logger';
import { CreateUserDto, LoginDto } from '@common/dto';
import { User } from '@common/entities';
import { getModelToken } from '@nestjs/mongoose';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtAuthService: jest.Mocked<JwtAuthService>;

  const mockUser = {
    _id: { toString: () => '507f1f77bcf86cd799439011' },
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    comparePassword: jest.fn(),
  } as any;

  const mockUserResponse = {
    id: '507f1f77bcf86cd799439011',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date('2024-01-01'),
  };

  const mockTokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

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

    service = module.get<AuthenticationService>(AuthenticationService);
    userRepository = module.get(UserRepository);
    jwtAuthService = module.get(JwtAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      userRepository.existsByEmail.mockResolvedValue(false);
      userRepository.create.mockResolvedValue(mockUser);
      jwtAuthService.generateTokens.mockResolvedValue(mockTokens);

      const result = await service.register(createUserDto);

      expect(userRepository.existsByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(jwtAuthService.generateTokens).toHaveBeenCalledWith(
        mockUser._id.toString(),
        mockUser.email,
      );
      expect(result).toEqual({
        user: expect.objectContaining({
          id: mockUser._id.toString(),
          name: mockUser.name,
          email: mockUser.email,
        }),
        tokens: mockTokens,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      userRepository.existsByEmail.mockResolvedValue(true);

      await expect(service.register(createUserDto)).rejects.toThrow(ConflictException);
      await expect(service.register(createUserDto)).rejects.toThrow(
        'User with this email already exists',
      );
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists during creation', async () => {
      userRepository.existsByEmail.mockResolvedValue(false);
      const error = new Error('Email already exists');
      userRepository.create.mockRejectedValue(error);

      await expect(service.register(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(true);
      jwtAuthService.generateTokens.mockResolvedValue(mockTokens);

      const result = await service.login(loginDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockUser.comparePassword).toHaveBeenCalledWith(loginDto.password);
      expect(jwtAuthService.generateTokens).toHaveBeenCalledWith(
        mockUser._id.toString(),
        mockUser.email,
      );
      expect(result).toEqual({
        user: expect.objectContaining({
          id: mockUser._id.toString(),
          name: mockUser.name,
          email: mockUser.email,
        }),
        tokens: mockTokens,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
      expect(mockUser.comparePassword).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('refreshToken', () => {
    const refreshTokenDto = {
      refreshToken: 'refresh-token',
    };

    const mockPayload = {
      sub: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      type: 'refresh' as const,
    };

    it('should refresh token successfully', async () => {
      jwtAuthService.verifyToken.mockResolvedValue(mockPayload);
      userRepository.findById.mockResolvedValue(mockUser);
      jwtAuthService.generateTokens.mockResolvedValue(mockTokens);

      const result = await service.refreshToken(refreshTokenDto);

      expect(jwtAuthService.verifyToken).toHaveBeenCalledWith(refreshTokenDto.refreshToken);
      expect(userRepository.findById).toHaveBeenCalledWith(mockPayload.sub);
      expect(jwtAuthService.generateTokens).toHaveBeenCalledWith(
        mockUser._id.toString(),
        mockUser.email,
      );
      expect(result).toEqual(mockTokens);
    });

    it('should throw UnauthorizedException if token type is not refresh', async () => {
      jwtAuthService.verifyToken.mockResolvedValue({
        ...mockPayload,
        type: 'access' as const,
      });

      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jwtAuthService.verifyToken.mockResolvedValue(mockPayload);
      userRepository.findById.mockResolvedValue(null);

      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });

    it('should throw UnauthorizedException if token verification fails', async () => {
      jwtAuthService.verifyToken.mockRejectedValue(new Error('Invalid token'));

      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      userRepository.findAll.mockResolvedValue(users);

      const result = await service.findAll();

      expect(userRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: mockUser._id.toString(),
          name: mockUser.name,
          email: mockUser.email,
        }),
      );
    });

    it('should return empty array if no users', async () => {
      userRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    const userId = '507f1f77bcf86cd799439011';

    it('should return user by id', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(
        expect.objectContaining({
          id: mockUser._id.toString(),
          name: mockUser.name,
          email: mockUser.email,
        }),
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.findById(userId)).rejects.toThrow(NotFoundException);
      await expect(service.findById(userId)).rejects.toThrow('User not found');
    });
  });
});

