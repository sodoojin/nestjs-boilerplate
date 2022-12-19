import { PaginateResponseDto } from '../../../../../types/paginate-response.dto';
import { Article } from '../../entities/article.entity';

export class JsonIndexResponseDto extends PaginateResponseDto<Article[]> {
  dataType: any = Article;
}
