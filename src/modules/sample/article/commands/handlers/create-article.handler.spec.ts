import { CreateArticleHandler } from './create-article.handler';
import { CreateArticleCommand } from '../create-article.command';
import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from '../../article.service';
import { when } from 'jest-when';
import { articleFactory } from '../../../../../database/factories/article.factory';

describe('CreateArticleHandler', () => {
  let handler: CreateArticleHandler;
  const articleService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateArticleHandler,
        {
          provide: ArticleService,
          useValue: articleService,
        },
      ],
    }).compile();

    handler = module.get(CreateArticleHandler);
  });

  it('execute', async () => {
    const params = {
      userId: 1,
      title: 'title',
      content: 'content',
      image: null,
    } as CreateArticleCommand;
    const article = articleFactory();

    when(articleService.create)
      .calledWith(params)
      .mockResolvedValueOnce(article);

    const result = await handler.execute(
      new CreateArticleCommand(
        params.userId,
        params.title,
        params.content,
        params.image,
      ),
    );

    expect(result).toBe(article);
  });
});
