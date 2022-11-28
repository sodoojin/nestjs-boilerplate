import { NestExpressApplication } from '@nestjs/platform-express';
import { basePath } from './helpers/directory';
import * as express from 'express';
import { ClassTransformer } from './helpers/class-transformer';
import * as device from 'express-device';
import sessionConfig from './config/session';
import * as expressSession from 'express-session';
import * as flash from 'connect-flash';
import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';
import { BadRequestFilter } from './filters/bad-request.filter';
import { ValidationPipe } from './pipes/validation.pipe';
import * as exphbs from 'express-handlebars';
import handlebarsHelpers from './handlebars-helpers';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { DefaultFilter } from './filters/default.filter';
import { AuthenticationFilter } from './filters/authentication.filter';

export function boot(app: NestExpressApplication) {
  app.use(expressSession(sessionConfig));
  app.use(flash());
  app.use(cookieParser(sessionConfig.secret));

  app.use(methodOverride('_method'));

  const hbs = exphbs.create({
    layoutsDir: basePath('../views'),
    defaultLayout: 'layout',
    extname: 'hbs',
    helpers: handlebarsHelpers,
  });
  app.engine('hbs', hbs.engine);
  app.setBaseViewsDir(basePath('../views'));
  app.setViewEngine('hbs');
  app.use(device.capture());

  app.useGlobalFilters(
    new DefaultFilter(),
    new BadRequestFilter(),
    new AuthenticationFilter(),
  );

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

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
}
