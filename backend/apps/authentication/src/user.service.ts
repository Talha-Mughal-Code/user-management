import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto, UserResponseDto } from '@common/dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const existingUser = await this.userRepository.findByEmail(
        createUserDto.email,
      );

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      this.logger.log(`User registered successfully: ${user.email}`);

      return new UserResponseDto({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error('Error during user registration', error.stack);
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    try {
      const users = await this.userRepository.findAll();

      return users.map(
        (user) =>
          new UserResponseDto({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          }),
      );
    } catch (error) {
      this.logger.error('Error fetching users', error.stack);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }
}

