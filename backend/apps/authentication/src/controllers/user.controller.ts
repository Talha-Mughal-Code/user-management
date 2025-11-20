import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../services';
import { UserResponseDto } from '@common/dto';
import { MESSAGE_PATTERNS } from '@common/constants/message-patterns';
import { handleRpcError } from '../utils';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(MESSAGE_PATTERNS.USER_FIND_ALL)
  async findAll(): Promise<UserResponseDto[]> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern(MESSAGE_PATTERNS.USER_FIND_BY_ID)
  async findById(@Payload() id: string): Promise<UserResponseDto> {
    try {
      return await this.userService.findById(id);
    } catch (error) {
      handleRpcError(error);
    }
  }
}
