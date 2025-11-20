import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import {
  CreateUserDto,
  UserResponseDto,
  LoginDto,
  AuthResponseDto,
  RefreshTokenDto,
  TokensDto,
} from '@common/dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthService } from './jwt/jwt.service';
import { LoggerService } from '@core/logger';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtAuthService: JwtAuthService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('AuthenticationService');
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    this.logger.info('Attempting to register user', { email: createUserDto.email });

    const existingUser = await this.userRepository.existsByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      this.logger.warn('User already exists', { email: createUserDto.email });
      throw new ConflictException('User with this email already exists');
    }

    try {
      const user = await this.userRepository.create(createUserDto);
      this.logger.info('User registered successfully', { 
        userId: user._id.toString(),
        email: user.email 
      });

      const tokens = await this.jwtAuthService.generateTokens(
        user._id.toString(),
        user.email,
      );

      const userResponse = plainToInstance(UserResponseDto, {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      });

      return {
        user: userResponse,
        tokens,
      };
    } catch (error: any) {
      this.logger.error('Registration failed', { 
        email: createUserDto.email,
        error: error.message 
      });
      if (error.message === 'Email already exists') {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.info('Attempting to login user', { email: loginDto.email });

    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      this.logger.warn('Login failed - user not found', { email: loginDto.email });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await (user as any).comparePassword(
      loginDto.password,
    );

    if (!isPasswordValid) {
      this.logger.warn('Login failed - invalid password', { email: loginDto.email });
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.info('User logged in successfully', { 
      userId: user._id.toString(),
      email: user.email 
    });

    const tokens = await this.jwtAuthService.generateTokens(
      user._id.toString(),
      user.email,
    );

    const userResponse = plainToInstance(UserResponseDto, {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });

    return {
      user: userResponse,
      tokens,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokensDto> {
    this.logger.info('Attempting to refresh token');

    try {
      const payload =
        await this.jwtAuthService.verifyToken(refreshTokenDto.refreshToken);

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.userRepository.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      this.logger.info('Token refreshed successfully', { 
        userId: user._id.toString(),
        email: user.email 
      });

      return await this.jwtAuthService.generateTokens(
        user._id.toString(),
        user.email,
      );
    } catch (error: any) {
      this.logger.warn('Token refresh failed', { error: error.message });
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    this.logger.info('Fetching all users');

    const users = await this.userRepository.findAll();

    this.logger.debug('Users fetched successfully', { count: users.length });

    return users.map((user) =>
      plainToInstance(UserResponseDto, {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }),
    );
  }

  async findById(id: string): Promise<UserResponseDto> {
    this.logger.info('Fetching user by ID', { userId: id });

    const user = await this.userRepository.findById(id);

    if (!user) {
      this.logger.warn('User not found', { userId: id });
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserResponseDto, {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  }
}
