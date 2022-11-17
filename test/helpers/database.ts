import * as fs from 'fs/promises';
import * as path from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

export async function databaseUp(queryRunner: QueryRunner) {
  const fileList = await fs.readdir(
    path.resolve(__dirname, '../../src/database/migrations'),
  );

  const migrations = fileList
    .filter((f) => f.match(/\.ts$/) !== null)
    .map((f) =>
      require(path.resolve(__dirname, '../../src/database/migrations', f)),
    )
    .map((module) => {
      const cls: MigrationInterface = new module[Object.keys(module)[0]]();

      return cls;
    });

  for (let i = 0; i < migrations.length; i++) {
    await migrations[i].up(queryRunner);
  }
}

export async function databaseDown(queryRunner: QueryRunner) {
  const connection = queryRunner.connection;
  await connection.dropDatabase();
}
