import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AuthModule } from './modules/auth/auth.module';
import { microservicesConfig } from '@core/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [microservicesConfig],
    }),
    AuthModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
