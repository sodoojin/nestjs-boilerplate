import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticle } from './types/create-article.interface';
import * as _ from 'lodash';
import { FileStorageService } from '../../file-storage/file-storage.service';
import { UpdateArticle } from './types/update-article.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private fileStorageService: FileStorageService,
  ) {}

  async create(dto: CreateArticle) {
    const article = this.articleRepository.create(
      _.pick(dto, ['userId', 'title', 'content']),
    );

    article.image = await this.fileStorageService.upload(dto.image, 'article');

    return this.articleRepository.save(article);
  }

  async update(article: Article, dto: UpdateArticle) {
    if (dto.image) {
      await this.fileStorageService.delete(article.image);
      article.image = await this.fileStorageService.upload(
        dto.image,
        'article',
      );
    }

    Object.assign(article, _.omit(dto, ['image']));

    return this.articleRepository.save(article);
  }

  async delete(article: Article) {
    await this.fileStorageService.delete(article.image);
    await this.articleRepository.delete(article.id);

    return true;
  }
}
