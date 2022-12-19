import { BaseResponseDto } from '../../../../../types/base-response.dto';
import { Article } from '../../entities/article.entity';

export class JsonIndexSingleResponseDto extends BaseResponseDto<Article> {
  dataType: any = Article;
}
