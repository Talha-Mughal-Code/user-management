import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto, UserResponseDto } from '@common/dto';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern('user.register')
  async register(
    @Payload() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    try {
      return await this.authenticationService.register(createUserDto);
    } catch (error: any) {
      if (error.status === 409 || error.statusCode === 409) {
        throw new RpcException({
          statusCode: 409,
          message: error.message || 'User with this email already exists',
          error: 'Conflict',
        });
      }
      throw new RpcException({
        statusCode: error.status || error.statusCode || 500,
        message: error.message || 'Internal server error',
        error: error.error || 'InternalServerError',
      });
    }
  }

  @MessagePattern('user.findAll')
  async findAll(): Promise<UserResponseDto[]> {
    return this.authenticationService.findAll();
  }

  @MessagePattern('user.findById')
  async findById(@Payload() id: string): Promise<UserResponseDto> {
    try {
      return await this.authenticationService.findById(id);
    } catch (error: any) {
      throw new RpcException({
        statusCode: error.status || error.statusCode || 500,
        message: error.message || 'Internal server error',
        error: error.error || 'InternalServerError',
      });
    }
  }
}
