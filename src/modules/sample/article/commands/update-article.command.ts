import { Article } from '../entities/article.entity';
import { UpdateArticle } from '../types/update-article.interface';

export class UpdateArticleCommand {
  constructor(public article: Article, public params: UpdateArticle) {}
}
