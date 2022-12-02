import { FileSystemStoredFile, IsFile } from 'nestjs-form-data';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  title?: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  @IsFile()
  image?: FileSystemStoredFile;
}
