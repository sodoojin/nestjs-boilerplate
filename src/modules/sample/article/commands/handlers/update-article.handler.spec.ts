import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from '../../article.service';
import { UpdateArticleHandler } from './update-article.handler';
import { articleFactory } from '../../../../../database/factories/article.factory';
import { UpdateArticleCommand } from '../update-article.command';
import { when } from 'jest-when';

describe('UpdateArticleHandler', () => {
  let handler: UpdateArticleHandler;
  const articleService = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateArticleHandler,
        {
          provide: ArticleService,
          useValue: articleService,
        },
      ],
    }).compile();

    handler = module.get(UpdateArticleHandler);
  });

  it('execute', async () => {
    const article = articleFactory(),
      updatedArticle = articleFactory();
    const params = {};

    when(articleService.update)
      .calledWith(article, params)
      .mockResolvedValueOnce(updatedArticle);

    const result = await handler.execute(
      new UpdateArticleCommand(article, params),
    );

    expect(result).toBe(updatedArticle);
  });
});
