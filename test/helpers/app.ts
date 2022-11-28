import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { boot } from '../../src/bootstrap';
import { NestExpressApplication } from '@nestjs/platform-express';

export async function createApplication() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule, ...(global.testingModules ?? [])],
  }).compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>();

  boot(app);

  await app.init();

  return app;
}
