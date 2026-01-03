import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './config/exceptions-filter.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const env = configService.get('env', { infer: true });

  app.setGlobalPrefix('api');
  app.use(cookieParser(env.cookie_secret));

  app.enableCors({
    origin: env.client_url,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  });

  // Global validation pipe for request data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter for handling errors
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(env.port ?? 8080);
  console.log(`Server is running on port ${env.port}`);
}

bootstrap();
