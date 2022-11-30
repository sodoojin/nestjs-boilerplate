import { FileSystemStoredFile } from 'nestjs-form-data';
import { basePath } from '../helpers/directory';

export default {
  storage: FileSystemStoredFile,
  fileSystemStoragePath: basePath('../storage'),
};
