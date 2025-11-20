import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import {
  CreateUserDto,
  UserResponseDto,
  AuthResponseDto,
  LoginDto,
  RefreshTokenDto,
  TokensDto,
} from '@common/dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthService } from '../jwt/jwt.service';
import { LoggerService } from '@core/logger';
import { ERROR_MESSAGES } from '@common/constants/error-messages';

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
    this.logger.info('Attempting to register user', {
      email: createUserDto.email,
    });

    const existingUser = await this.userRepository.existsByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      this.logger.warn('User already exists', { email: createUserDto.email });
      throw new ConflictException(ERROR_MESSAGES.USER_EXISTS);
    }

    try {
      const user = await this.userRepository.create(createUserDto);
      this.logger.info('User registered successfully', {
        userId: user._id.toString(),
        email: user.email,
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error('Registration failed', {
        email: createUserDto.email,
        error: errorMessage,
      });
      if (errorMessage === ERROR_MESSAGES.EMAIL_EXISTS) {
        throw new ConflictException(ERROR_MESSAGES.USER_EXISTS);
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.info('Attempting to login user', { email: loginDto.email });

    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      this.logger.warn('Login failed - user not found', {
        email: loginDto.email,
      });
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await user.comparePassword(loginDto.password);

    if (!isPasswordValid) {
      this.logger.warn('Login failed - invalid password', {
        email: loginDto.email,
      });
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    this.logger.info('User logged in successfully', {
      userId: user._id.toString(),
      email: user.email,
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
      const payload = await this.jwtAuthService.verifyToken(
        refreshTokenDto.refreshToken,
      );

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN_TYPE);
      }

      const user = await this.userRepository.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      this.logger.info('Token refreshed successfully', {
        userId: user._id.toString(),
        email: user.email,
      });

      return await this.jwtAuthService.generateTokens(
        user._id.toString(),
        user.email,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.warn('Token refresh failed', { error: errorMessage });
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }
}
