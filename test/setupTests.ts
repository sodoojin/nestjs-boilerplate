import { databaseDown, databaseUp } from './helpers/database';
import { createApplication } from './helpers/app';
import { DataSource } from 'typeorm';

global.beforeEach(async () => {
  global.app = await createApplication();

  const dataSource = global.app.get(DataSource);

  await databaseUp(dataSource.createQueryRunner());
});

global.afterEach(async () => {
  const dataSource = global.app.get(DataSource);

  await databaseDown(dataSource.createQueryBuilder());
});
