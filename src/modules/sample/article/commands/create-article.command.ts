import { FileSystemStoredFile } from 'nestjs-form-data';

export class CreateArticleCommand {
  constructor(
    public readonly userId: number,
    public readonly title: string,
    public readonly content: string,
    public readonly image: FileSystemStoredFile,
  ) {}
}
