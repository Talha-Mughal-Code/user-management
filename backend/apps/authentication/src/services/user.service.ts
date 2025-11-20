import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserResponseDto } from '@common/dto';
import { plainToInstance } from 'class-transformer';
import { LoggerService } from '@core/logger';
import { ERROR_MESSAGES } from '@common/constants/error-messages';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('UserService');
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
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return plainToInstance(UserResponseDto, {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  }
}
