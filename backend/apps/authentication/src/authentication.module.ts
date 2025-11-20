import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { User, UserSchema } from '@common/entities';
import { UserRepository } from './repositories/user.repository';
import { JwtAuthService } from './jwt/jwt.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { databaseConfig, jwtConfig, loggerConfig } from '@core/config';
import { DatabaseModule } from '@core/database/database.module';
import { LoggerModule } from '@core/logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, loggerConfig],
    }),
    DatabaseModule,
    LoggerModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    UserRepository,
    JwtAuthService,
    JwtStrategy,
  ],
  exports: [JwtAuthService, JwtStrategy, PassportModule],
})
export class AuthenticationModule {}
