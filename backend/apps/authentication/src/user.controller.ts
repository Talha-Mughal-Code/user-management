import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto, UserResponseDto } from '@common/dto';
import { MESSAGE_PATTERNS } from '@common/constants/message-patterns';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(MESSAGE_PATTERNS.USER_REGISTER)
  async register(
    @Payload() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.register(createUserDto);
  }

  @MessagePattern(MESSAGE_PATTERNS.USER_FIND_ALL)
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }
}

