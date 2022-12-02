import { FileSystemStoredFile } from 'nestjs-form-data';

export interface CreateArticle {
  userId: number;
  title: string;
  content: string;
  image: FileSystemStoredFile;
}
