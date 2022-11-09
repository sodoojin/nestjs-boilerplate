import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { basePath } from './helpers/directory';
import * as device from 'express-device';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(basePath('../views'));
  app.setViewEngine('hbs');
  app.use(device.capture());

  device.enableViewRouting(app, {});

  await app.listen(3000);
}
bootstrap();
