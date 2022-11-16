import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './config/database-config.service';
import { FileSystemStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { basePath } from './helpers/directory';
import { UserModule } from './modules/user/user.module';
import './database/polyfill';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
    }),
    NestjsFormDataModule.config({
      storage: FileSystemStoredFile,
      fileSystemStoragePath: basePath('../storage'),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
