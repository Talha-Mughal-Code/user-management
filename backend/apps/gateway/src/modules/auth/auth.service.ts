import { Injectable, Inject, Logger, HttpException, HttpStatus } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    this.logger.log(`Forwarding registration request to auth service: ${createUserDto.email}`);

    try {
      const result = await firstValueFrom(
        this.authClient.send<AuthResponseDto>('user.register', createUserDto),
      );
      this.logger.log(`User registered successfully: ${result.user.email}`);
      return result;
    } catch (error: any) {
      this.logger.error(`Registration failed: ${error.message}`, error.stack);
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
    this.logger.log(`Forwarding login request to auth service: ${loginDto.email}`);

    try {
      const result = await firstValueFrom(
        this.authClient.send<AuthResponseDto>('user.login', loginDto),
      );
      this.logger.log(`User logged in successfully: ${result.user.email}`);
      return result;
    } catch (error: any) {
      this.logger.error(`Login failed: ${error.message}`, error.stack);
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
    this.logger.log('Forwarding token refresh request to auth service');

    try {
      const result = await firstValueFrom(
        this.authClient.send<TokensDto>('user.refresh', refreshTokenDto),
      );
      this.logger.log('Token refreshed successfully');
      return result;
    } catch (error: any) {
      this.logger.error(`Token refresh failed: ${error.message}`, error.stack);
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
    this.logger.log('Forwarding find all users request to auth service');

    try {
      const result = await firstValueFrom(
        this.authClient.send<UserResponseDto[]>('user.findAll', {}),
      );
      this.logger.log(`Retrieved ${result.length} users`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findById(id: string): Promise<UserResponseDto> {
    this.logger.log(`Forwarding find user by ID request to auth service: ${id}`);

    try {
      const result = await firstValueFrom(
        this.authClient.send<UserResponseDto>('user.findById', id),
      );
      this.logger.log(`User retrieved successfully: ${result.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch user: ${error.message}`, error.stack);
      throw error;
    }
  }
}

