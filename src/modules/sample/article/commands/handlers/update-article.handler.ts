import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateArticleCommand } from '../update-article.command';
import { ArticleService } from '../../article.service';

@CommandHandler(UpdateArticleCommand)
export class UpdateArticleHandler
  implements ICommandHandler<UpdateArticleCommand>
{
  constructor(private articleService: ArticleService) {}

  async execute(command: UpdateArticleCommand) {
    return this.articleService.update(command.article, command.params);
  }
}
