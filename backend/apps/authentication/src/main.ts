import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AuthenticationModule } from './authentication.module';

async function bootstrap() {
  const logger = new Logger('AuthenticationService');
  const port = parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10);
  const host = process.env.AUTH_SERVICE_HOST || 'localhost';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule,
    {
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen();
  logger.log(`Authentication microservice is running on ${host}:${port}`);
}

bootstrap();
