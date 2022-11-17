import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createApplication } from '../helpers/app';

describe('UserController (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    app = await createApplication();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
