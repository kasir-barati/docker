import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from './configs/app.config';
import { createSwaggerConfiguration } from './utils/create-swagger-configuration.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { PORT, SWAGGER_PATH } = app.get<ConfigType<typeof appConfig>>(
    appConfig.KEY,
  );
  const appUrl = `http://localhost:${PORT}/`;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: 400,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
    }),
  );
  createSwaggerConfiguration({
    app,
    appUrl,
    swaggerPath: SWAGGER_PATH,
    title: 'App.',
    description: 'App RESTful API.',
  });

  await app.listen(PORT);
}
bootstrap();
