import * as path from 'path';

export function basePath(...paths) {
  return path.resolve(__dirname, '../', ...paths);
}
