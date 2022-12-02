import { IsNumber, IsOptional } from 'class-validator';

export class SearchArticleDto {
  @IsOptional()
  title: string;

  @IsOptional()
  content: string;

  @IsNumber()
  page = 1;
}
