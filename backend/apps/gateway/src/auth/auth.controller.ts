import {
  Controller,
  Post,
  Get,
  Body,
  Inject,
  HttpStatus,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, UserResponseDto } from '@common/dto';
import { MESSAGE_PATTERNS } from '@common/constants/message-patterns';
import { firstValueFrom } from 'rxjs';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject('AUTHENTICATION_SERVICE') private authClient: ClientProxy,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation error',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - user already exists',
  })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    this.logger.log(`Registration request for email: ${createUserDto.email}`);

    return firstValueFrom(
      this.authClient.send<UserResponseDto>(
        MESSAGE_PATTERNS.USER_REGISTER,
        createUserDto,
      ),
    );
  }

  @Get('users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all registered users' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: [UserResponseDto],
  })
  async getUsers(): Promise<UserResponseDto[]> {
    this.logger.log('Fetching all users');

    return firstValueFrom(
      this.authClient.send<UserResponseDto[]>(MESSAGE_PATTERNS.USER_FIND_ALL, {}),
    );
  }
}

