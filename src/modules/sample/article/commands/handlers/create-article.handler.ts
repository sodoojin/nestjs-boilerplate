import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateArticleCommand } from '../create-article.command';
import { Article } from '../../entities/article.entity';
import { ArticleService } from '../../article.service';

@CommandHandler(CreateArticleCommand)
export class CreateArticleHandler
  implements ICommandHandler<CreateArticleCommand>
{
  constructor(private articleService: ArticleService) {}

  async execute(command: CreateArticleCommand): Promise<Article> {
    return this.articleService.create({
      userId: command.userId,
      title: command.title,
      content: command.content,
      image: command.image,
    });
  }
}
