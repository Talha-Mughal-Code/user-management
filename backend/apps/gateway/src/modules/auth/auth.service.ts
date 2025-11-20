import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CreateUserDto,
  AuthResponseDto,
  LoginDto,
  RefreshTokenDto,
  TokensDto,
  UserResponseDto,
} from '@common/dto';
import { LoggerService } from '@core/logger';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('AuthService');
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    this.logger.info('Forwarding registration request to auth service', { 
      email: createUserDto.email 
    });

    try {
      const result = await firstValueFrom(
        this.authClient.send<AuthResponseDto>('user.register', createUserDto),
      );
      this.logger.info('User registered successfully', { 
        userId: result.user.id,
        email: result.user.email 
      });
      return result;
    } catch (error: any) {
      this.logger.error('Registration failed', {
        email: createUserDto.email,
        error: error.message,
        stack: error.stack,
      });
      if (error.statusCode || error.status) {
        throw new HttpException(
          error.message || 'An error occurred',
          error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.info('Forwarding login request to auth service', { 
      email: loginDto.email 
    });

    try {
      const result = await firstValueFrom(
        this.authClient.send<AuthResponseDto>('user.login', loginDto),
      );
      this.logger.info('User logged in successfully', { 
        userId: result.user.id,
        email: result.user.email 
      });
      return result;
    } catch (error: any) {
      this.logger.error('Login failed', {
        email: loginDto.email,
        error: error.message,
        stack: error.stack,
      });
      if (error.statusCode || error.status) {
        throw new HttpException(
          error.message || 'An error occurred',
          error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokensDto> {
    this.logger.info('Forwarding token refresh request to auth service');

    try {
      const result = await firstValueFrom(
        this.authClient.send<TokensDto>('user.refresh', refreshTokenDto),
      );
      this.logger.info('Token refreshed successfully');
      return result;
    } catch (error: any) {
      this.logger.error('Token refresh failed', {
        error: error.message,
        stack: error.stack,
      });
      if (error.statusCode || error.status) {
        throw new HttpException(
          error.message || 'An error occurred',
          error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    this.logger.info('Forwarding find all users request to auth service');

    try {
      const result = await firstValueFrom(
        this.authClient.send<UserResponseDto[]>('user.findAll', {}),
      );
      this.logger.info('Retrieved users successfully', { count: result.length });
      return result;
    } catch (error: any) {
      this.logger.error('Failed to fetch users', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async findById(id: string): Promise<UserResponseDto> {
    this.logger.info('Forwarding find user by ID request to auth service', { 
      userId: id 
    });

    try {
      const result = await firstValueFrom(
        this.authClient.send<UserResponseDto>('user.findById', id),
      );
      this.logger.info('User retrieved successfully', { 
        userId: result.id,
        email: result.email 
      });
      return result;
    } catch (error: any) {
      this.logger.error('Failed to fetch user', {
        userId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

