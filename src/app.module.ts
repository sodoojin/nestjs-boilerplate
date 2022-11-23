import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './config/database-config.service';
import { FileSystemStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { basePath } from './helpers/directory';
import './database/polyfill';
import { ValidationMiddleware } from './middlewares/validation.middleware';
import { SampleModule } from './modules/sample/sample.module';
import { InjectableValidators } from './validators';

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
    SampleModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...InjectableValidators],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(ValidationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
