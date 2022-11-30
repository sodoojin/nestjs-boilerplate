import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { boot } from '../../src/bootstrap';
import { NestExpressApplication } from '@nestjs/platform-express';

export async function createApplication() {
  const additionalModules = globalThis.testing.modules ?? [];

  if (additionalModules.length > 0) {
    const imports = Reflect.getMetadata('imports', AppModule);

    Reflect.defineMetadata(
      'imports',
      imports.concat(...additionalModules),
      AppModule,
    );
  }

  const module = Test.createTestingModule({
    imports: [AppModule],
  });

  (globalThis.testing.providers ?? []).forEach((provider) => {
    module.overrideProvider(provider.provide).useValue(provider.useValue);
  });

  const moduleFixture: TestingModule = await module.compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>();

  boot(app);

  await app.init();

  return app;
}
