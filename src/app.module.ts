import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './config/database-config.service';
import { FileSystemStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { basePath } from './helpers/directory';
import './database/polyfill';
import { ValidationMiddleware } from './middlewares/validation.middleware';
import { SampleModule } from './modules/sample/sample.module';
import { InjectableValidators } from './validators';
import { CaslModule } from 'nest-casl';
import { Roles } from './app.roles';
import { AuthModule } from './modules/auth/auth.module';
import cacheConfig from './config/cache';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    NestjsFormDataModule.config({
      storage: FileSystemStoredFile,
      fileSystemStoragePath: basePath('../storage'),
    }),
    CaslModule.forRoot<Roles>({
      getUserFromRequest: (request) => request.user,
    }),
    CacheModule.register(cacheConfig),
    SampleModule,
    AuthModule,
  ],
  controllers: [],
  providers: [...InjectableValidators],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(ValidationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
