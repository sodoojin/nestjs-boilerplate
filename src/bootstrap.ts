import { NestExpressApplication } from '@nestjs/platform-express';
import { basePath } from './helpers/directory';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { ClassTransformer } from './helpers/class-transformer';
import * as device from 'express-device';
import sessionConfig from './config/session';
import * as expressSession from 'express-session';
import * as flash from 'connect-flash';
import * as cookieParser from 'cookie-parser';

export function boot(app: NestExpressApplication) {
  app.use(expressSession(sessionConfig));
  app.use(flash());
  app.use(cookieParser(sessionConfig.secret));

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
}
