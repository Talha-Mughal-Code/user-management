import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import {
  CreateUserDto,
  UserResponseDto,
  LoginDto,
  AuthResponseDto,
  RefreshTokenDto,
  TokensDto,
} from '@common/dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthService } from './jwt/jwt.service';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
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

      const tokens = await this.jwtAuthService.generateTokens(
        user._id.toString(),
        user.email,
      );

      const userResponse = plainToInstance(UserResponseDto, {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      });

      return {
        user: userResponse,
        tokens,
      };
    } catch (error: any) {
      if (error.message === 'Email already exists') {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    this.logger.log(`Attempting to login user: ${loginDto.email}`);

    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      this.logger.warn(`Login failed - user not found: ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await (user as any).comparePassword(
      loginDto.password,
    );

    if (!isPasswordValid) {
      this.logger.warn(`Login failed - invalid password: ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in successfully: ${user.email}`);

    const tokens = await this.jwtAuthService.generateTokens(
      user._id.toString(),
      user.email,
    );

    const userResponse = plainToInstance(UserResponseDto, {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });

    return {
      user: userResponse,
      tokens,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokensDto> {
    this.logger.log('Attempting to refresh token');

    try {
      const payload =
        await this.jwtAuthService.verifyToken(refreshTokenDto.refreshToken);

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.userRepository.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      this.logger.log(`Token refreshed successfully for user: ${user.email}`);

      return await this.jwtAuthService.generateTokens(
        user._id.toString(),
        user.email,
      );
    } catch (error: any) {
      this.logger.warn(`Token refresh failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired refresh token');
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
