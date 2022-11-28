import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { User } from '../../../src/modules/sample/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { userFactory } from '../../../src/database/factories/user.factory';

describe('sample/CqrsController (e2e)', () => {
  let app: NestExpressApplication;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    app = global.app;
    userRepository = app.get(getRepositoryToken(User));
  });

  it('/ (POST)', async () => {
    const data = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.lorem.word(),
    };
    await request(app.getHttpServer())
      .post('/sample/cqrs')
      .send(data)
      .expect(201);

    const user = await userRepository.findOne({ where: {} });
    expect(
      _.omit(user, ['id', 'password', 'createdAt', 'updatedAt', 'fullName']),
    ).toEqual(_.omit(data, 'password'));
  });

  it('/search (GET)', async () => {
    const user = await userRepository.save(userFactory());

    const response = await request(app.getHttpServer())
      .get('/sample/cqrs/search')
      .query({
        email: user.email,
      });

    expect(response.status).toEqual(200);
    expect(
      response.body.map((body) => _.omit(body, 'fullName', 'articles')),
    ).toEqual([
      {
        ..._.omit(user, 'fullName', 'articles'),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    ]);
  });
});
