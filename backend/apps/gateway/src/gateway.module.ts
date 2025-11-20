import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AuthModule } from './modules/auth/auth.module';
import {
  microservicesConfig,
  databaseConfig,
  jwtConfig,
  loggerConfig,
} from '@core/config';
import { DatabaseModule } from '@core/database/database.module';
import { LoggerModule } from '@core/logger';
import { RequestLoggingInterceptor } from '@common/interceptors';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
} from '@common/filters';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [microservicesConfig, databaseConfig, jwtConfig, loggerConfig],
    }),
    DatabaseModule,
    LoggerModule,
    AuthModule,
  ],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class GatewayModule {}
