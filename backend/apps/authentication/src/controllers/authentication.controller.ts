import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from '../services';
import {
  CreateUserDto,
  AuthResponseDto,
  LoginDto,
  RefreshTokenDto,
  TokensDto,
} from '@common/dto';
import { MESSAGE_PATTERNS } from '@common/constants/message-patterns';
import { handleRpcError } from '../utils';

@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @MessagePattern(MESSAGE_PATTERNS.USER_REGISTER)
  async register(
    @Payload() createUserDto: CreateUserDto,
  ): Promise<AuthResponseDto> {
    try {
      return await this.authenticationService.register(createUserDto);
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern(MESSAGE_PATTERNS.USER_LOGIN)
  async login(@Payload() loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      return await this.authenticationService.login(loginDto);
    } catch (error) {
      handleRpcError(error);
    }
  }

  @MessagePattern(MESSAGE_PATTERNS.USER_REFRESH)
  async refreshToken(
    @Payload() refreshTokenDto: RefreshTokenDto,
  ): Promise<TokensDto> {
    try {
      return await this.authenticationService.refreshToken(refreshTokenDto);
    } catch (error) {
      handleRpcError(error);
    }
  }
}
