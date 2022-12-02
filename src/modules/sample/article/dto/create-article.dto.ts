import { FileSystemStoredFile } from 'nestjs-form-data';
import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty({ message: '제목을 입력해 주세요.' })
  title: string;

  @IsNotEmpty({ message: '내용을 입력해 주세요.' })
  content: string;

  @IsNotEmpty({ message: '이미지를 입력해 주세요.' })
  image: FileSystemStoredFile;
}
