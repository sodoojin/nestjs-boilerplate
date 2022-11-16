import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { basePath } from './helpers/directory';
import * as device from 'express-device';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { ClassTransformer } from './helpers/class-transformer';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(basePath('../views'));
  app.setViewEngine('hbs');
  app.use(device.capture());

  device.enableViewRouting(app, {});

  app.enableCors();
  app.use(
    express.json({
      limit: '50mb',
    }),
  );
  app.use(
    express.urlencoded({
      limit: '50mb',
      extended: true,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      transformerPackage: ClassTransformer,
    }),
  );

  await app.listen(3000);
}
bootstrap();
