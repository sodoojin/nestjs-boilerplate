import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from '../../entities/article.entity';
import { PaginateArticleListHandler } from './paginate-article-list.handler';
import { PaginateArticleListQuery } from '../paginate-article-list.query';
import { when } from 'jest-when';
import { In } from 'typeorm';
import { articleFactory } from '../../../../../database/factories/article.factory';

describe('PaginateArticleListHandler', () => {
  const articleRepository = {
    createQueryBuilder: jest.fn(),
    find: jest.fn(),
  };
  let handler: PaginateArticleListHandler;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaginateArticleListHandler,
        { provide: getRepositoryToken(Article), useValue: articleRepository },
      ],
    }).compile();

    handler = module.get(PaginateArticleListHandler);
  });

  it('execute', async () => {
    const findResults = [1, 2, 3].map(() => articleFactory());
    const params = {
      title: 'title',
      firstName: 'firstName',
      page: 1,
    };
    const query = {
      leftJoin: jest.fn(),
      orderBy: jest.fn(),
      groupBy: jest.fn(),
      andWhere: jest.fn(),
      paginate: jest.fn(),
    };
    const paginateResult = {
      itemKeys: [1, 2, 3],
      meta: {
        itemCount: 1,
        totalItemCount: 2,
        itemsPerPage: 3,
        totalPage: 4,
        currentPage: 5,
      },
    };

    when(articleRepository.createQueryBuilder)
      .calledWith('article')
      .mockReturnValueOnce(query);

    when(query.leftJoin)
      .calledWith('article.user', 'user')
      .mockReturnValueOnce(query);

    when(query.orderBy)
      .calledWith('article.createdAt', 'DESC')
      .mockReturnValueOnce(query);

    when(query.groupBy).calledWith('article.id').mockReturnValueOnce(query);

    when(query.paginate)
      .calledWith(params.page, 10, 'article_id')
      .mockResolvedValueOnce(paginateResult);

    when(articleRepository.find)
      .calledWith({
        where: {
          id: In(paginateResult.itemKeys),
        },
        relations: ['user'],
        order: {
          createdAt: 'DESC',
        },
      })
      .mockResolvedValueOnce(findResults);

    const result = await handler.execute(new PaginateArticleListQuery(params));

    expect(result).toEqual({
      items: findResults,
      meta: paginateResult.meta,
    });

    expect(query.andWhere).toHaveBeenCalledWith('article.title LIKE :title', {
      title: `%${params.title}%`,
    });

    expect(query.andWhere).toHaveBeenCalledWith(
      'user.firstName LIKE :firstName',
      {
        firstName: `%${params.firstName}%`,
      },
    );
  });
});
