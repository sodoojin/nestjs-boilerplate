import { databaseDown, databaseUp } from './helpers/database';
import { createApplication } from './helpers/app';
import { DataSource } from 'typeorm';

globalThis.testing = {};

globalThis.beforeEach(async () => {
  globalThis.app = await createApplication();

  const dataSource = globalThis.app.get(DataSource);

  await databaseUp(dataSource.createQueryRunner());
});

globalThis.afterEach(async () => {
  const dataSource = globalThis.app.get(DataSource);

  await databaseDown(dataSource.createQueryBuilder());
});
