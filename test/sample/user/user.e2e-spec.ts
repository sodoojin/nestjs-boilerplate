import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { faker } from '@faker-js/faker/locale/ko';
import { Repository } from 'typeorm';
import { User } from '../../../src/modules/sample/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as _ from 'lodash';

describe('sample/UserController (e2e)', () => {
  let app: NestExpressApplication;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    app = globalThis.app;
    userRepository = app.get(getRepositoryToken(User));
  });

  it('/user (POST)', async () => {
    const data = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: 'password',
    };

    await request(app.getHttpServer())
      .post('/sample/user')
      .send(data)
      .expect(302);

    const user = await userRepository.findOne({
      where: {
        ..._.omit(data, 'password'),
      },
    });
    expect(user).not.toBe(null);
  });
});
