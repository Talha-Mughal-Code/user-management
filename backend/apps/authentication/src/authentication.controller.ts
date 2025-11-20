import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto, UserResponseDto } from '@common/dto';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern('user.register')
  async register(
    @Payload() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.authenticationService.register(createUserDto);
  }

  @MessagePattern('user.findAll')
  async findAll(): Promise<UserResponseDto[]> {
    return this.authenticationService.findAll();
  }

  @MessagePattern('user.findById')
  async findById(@Payload() id: string): Promise<UserResponseDto> {
    return this.authenticationService.findById(id);
  }
}
