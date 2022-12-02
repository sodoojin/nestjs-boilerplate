import { FileSystemStoredFile } from 'nestjs-form-data';

export interface UpdateArticle {
  userId?: number;
  title?: string;
  content?: string;
  image?: FileSystemStoredFile;
}
