import { forwardRef, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { FileStorageModule } from '../../file-storage/file-storage.module';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { CaslModule } from 'nest-casl';
import { permissions } from './article.permissions';

@Module({
  imports: [
    CaslModule.forFeature({ permissions }),
    CqrsModule,
    forwardRef(() => FileStorageModule),
    TypeOrmModule.forFeature([Article]),
  ],
  providers: [ArticleService, ...CommandHandlers, ...QueryHandlers],
  controllers: [ArticleController],
  exports: [TypeOrmModule, ArticleService],
})
export class ArticleModule {}
