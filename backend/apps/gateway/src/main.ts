import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GatewayModule } from './gateway.module';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
} from '@common/filters';
import {
  LoggingInterceptor,
  TransformInterceptor,
} from '@common/interceptors';

async function bootstrap() {
  const logger = new Logger('Gateway');
  const app = await NestFactory.create(GatewayModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  });

  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpExceptionFilter(),
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('API Gateway for User Management System')
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication and management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = parseInt(process.env.GATEWAY_PORT || '3000', 10);
  await app.listen(port);

  logger.log(`Gateway is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
