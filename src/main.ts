import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { validationExceptionFactory } from './common/utils/validation.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);

  // Security headers
  app.use(helmet());

  // Cookie parser for req.cookies (e.g. refresh token)
  app.use(cookieParser());

  // Global validation pipe – 422 + error_code + errors for validation failures
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: validationExceptionFactory,
    }),
  );

  // API prefix
  const apiPrefix = configService.get<string>('app.apiPrefix');
  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }

  // CORS - Environment driven
  const corsOrigins = configService.get<string[]>('app.corsOrigin');
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Swagger Documentation
  const swaggerConfig = configService.get('app.swagger');
  if (swaggerConfig?.enabled) {
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerConfig.path, app, document);

    logger.log(`Swagger documentation available at /${swaggerConfig.path}`);
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
  logger.log(`Environment: ${configService.get<string>('app.nodeEnv')}`);
}

bootstrap();
