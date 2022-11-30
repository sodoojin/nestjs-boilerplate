import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './config/database-config.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import './database/polyfill';
import { ValidationMiddleware } from './middlewares/validation.middleware';
import { SampleModule } from './modules/sample/sample.module';
import { InjectableValidators } from './validators';
import { CaslModule } from 'nest-casl';
import { Roles } from './app.roles';
import { AuthModule } from './modules/auth/auth.module';
import cacheConfig from './config/cache';
import awsConfig from './config/aws';
import nestjsFormDataConfig from './config/nestjs-form-data';
import { AwsSdkModule } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import { FileStorageModule } from './modules/file-storage/file-storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    NestjsFormDataModule.config(nestjsFormDataConfig),
    CaslModule.forRoot<Roles>({
      getUserFromRequest: (request) => request.user,
    }),
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useFactory: awsConfig,
        imports: [ConfigModule],
        inject: [ConfigService],
      },
      services: [S3],
    }),
    CacheModule.register(cacheConfig),
    SampleModule,
    AuthModule,
    FileStorageModule,
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
