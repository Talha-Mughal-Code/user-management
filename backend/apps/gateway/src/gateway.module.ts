import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AuthModule } from './modules/auth/auth.module';
import { microservicesConfig, databaseConfig, jwtConfig } from '@core/config';
import { DatabaseModule } from '@core/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [microservicesConfig, databaseConfig, jwtConfig],
    }),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
