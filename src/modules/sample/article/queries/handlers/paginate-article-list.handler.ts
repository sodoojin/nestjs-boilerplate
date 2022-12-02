import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginateArticleListQuery } from '../paginate-article-list.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../../entities/article.entity';
import { In, Repository } from 'typeorm';

@QueryHandler(PaginateArticleListQuery)
export class PaginateArticleListHandler
  implements IQueryHandler<PaginateArticleListQuery>
{
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
  ) {}

  async execute(query: PaginateArticleListQuery) {
    const q = this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.user', 'user')
      .orderBy('article.createdAt', 'DESC')
      .groupBy('article.id');

    if (query.params.title) {
      q.andWhere('article.title LIKE :title', {
        title: `%${query.params.title}%`,
      });
    }

    if (query.params.firstName) {
      q.andWhere('user.firstName LIKE :firstName', {
        firstName: `%${query.params.firstName}%`,
      });
    }

    const result = await q.paginate(query.params.page, 10, 'article_id');

    return {
      items: await this.articleRepository.find({
        where: {
          id: In(result.itemKeys),
        },
        relations: ['user'],
        order: {
          createdAt: 'DESC',
        },
      }),
      meta: result.meta,
    };
  }
}
