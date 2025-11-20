import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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
import { MESSAGE_PATTERNS } from '@common/constants/message-patterns';
import { ERROR_MESSAGES } from '@common/constants/error-messages';

interface RpcErrorResponse {
  statusCode?: number;
  status?: number;
  message?: string;
  error?: string;
}

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
        this.authClient.send<AuthResponseDto>(MESSAGE_PATTERNS.USER_REGISTER, createUserDto),
      );
      this.logger.info('User registered successfully', { 
        userId: result.user.id,
        email: result.user.email 
      });
      return result;
    } catch (error) {
      const errorResponse = error as RpcErrorResponse;
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_ERROR;
      const stack = error instanceof Error ? error.stack : undefined;
      
      this.logger.error('Registration failed', {
        email: createUserDto.email,
        error: errorMessage,
        stack,
      });
      
      if (errorResponse?.statusCode || errorResponse?.status) {
        throw new HttpException(
          errorResponse.message || errorMessage,
          errorResponse.statusCode || errorResponse.status || HttpStatus.INTERNAL_SERVER_ERROR,
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
        this.authClient.send<AuthResponseDto>(MESSAGE_PATTERNS.USER_LOGIN, loginDto),
      );
      this.logger.info('User logged in successfully', { 
        userId: result.user.id,
        email: result.user.email 
      });
      return result;
    } catch (error) {
      const errorResponse = error as RpcErrorResponse;
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_ERROR;
      const stack = error instanceof Error ? error.stack : undefined;
      
      this.logger.error('Login failed', {
        email: loginDto.email,
        error: errorMessage,
        stack,
      });
      
      if (errorResponse?.statusCode || errorResponse?.status) {
        throw new HttpException(
          errorResponse.message || errorMessage,
          errorResponse.statusCode || errorResponse.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokensDto> {
    this.logger.info('Forwarding token refresh request to auth service');

    try {
      const result = await firstValueFrom(
        this.authClient.send<TokensDto>(MESSAGE_PATTERNS.USER_REFRESH, refreshTokenDto),
      );
      this.logger.info('Token refreshed successfully');
      return result;
    } catch (error) {
      const errorResponse = error as RpcErrorResponse;
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_ERROR;
      const stack = error instanceof Error ? error.stack : undefined;
      
      this.logger.error('Token refresh failed', {
        error: errorMessage,
        stack,
      });
      
      if (errorResponse?.statusCode || errorResponse?.status) {
        throw new HttpException(
          errorResponse.message || errorMessage,
          errorResponse.statusCode || errorResponse.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    this.logger.info('Forwarding find all users request to auth service');

    try {
      const result = await firstValueFrom(
        this.authClient.send<UserResponseDto[]>(MESSAGE_PATTERNS.USER_FIND_ALL, {}),
      );
      this.logger.info('Retrieved users successfully', { count: result.length });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_ERROR;
      const stack = error instanceof Error ? error.stack : undefined;
      
      this.logger.error('Failed to fetch users', {
        error: errorMessage,
        stack,
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
        this.authClient.send<UserResponseDto>(MESSAGE_PATTERNS.USER_FIND_BY_ID, id),
      );
      this.logger.info('User retrieved successfully', { 
        userId: result.id,
        email: result.email 
      });
      return result;
    } catch (error) {
      const errorResponse = error as RpcErrorResponse;
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_ERROR;
      const stack = error instanceof Error ? error.stack : undefined;
      
      this.logger.error('Failed to fetch user', {
        userId: id,
        error: errorMessage,
        stack,
      });
      
      if (errorResponse?.statusCode || errorResponse?.status) {
        throw new HttpException(
          errorResponse.message || errorMessage,
          errorResponse.statusCode || errorResponse.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw error;
    }
  }
}

