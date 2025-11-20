import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto, UserResponseDto } from '@common/dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Attempting to register user: ${createUserDto.email}`);

    const existingUser = await this.userRepository.existsByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      this.logger.warn(`User already exists: ${createUserDto.email}`);
      throw new ConflictException('User with this email already exists');
    }

    try {
      const user = await this.userRepository.create(createUserDto);
      this.logger.log(`User registered successfully: ${user.email}`);

      return plainToInstance(UserResponseDto, {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      });
    } catch (error: any) {
      if (error.message === 'Email already exists') {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    this.logger.log('Fetching all users');

    const users = await this.userRepository.findAll();

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
    this.logger.log(`Fetching user by ID: ${id}`);

    const user = await this.userRepository.findById(id);

    if (!user) {
      this.logger.warn(`User not found: ${id}`);
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
