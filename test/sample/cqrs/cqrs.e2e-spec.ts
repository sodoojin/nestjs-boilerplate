import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { User } from '../../../src/modules/sample/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { userFactory } from '../../../src/database/factories/user.factory';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common';

describe('sample/CqrsController (e2e)', () => {
  let app: NestExpressApplication;
  let userRepository: Repository<User>;
  let cacheManager: Cache;

  beforeEach(async () => {
    app = globalThis.app;
    userRepository = app.get(getRepositoryToken(User));
    cacheManager = app.get(CACHE_MANAGER);
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

  it('/search-cache (GET)', async () => {
    expect(await cacheManager.get('GetCqrsCacheHandler')).toEqual(undefined);

    const user = await userRepository.save(userFactory({ id: null }));

    await request(app.getHttpServer())
      .get('/sample/cqrs/search-cache')
      .expect([
        {
          ..._.omit(user, 'fullName', 'articles'),
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      ]);

    const user2 = await userRepository.save(userFactory({ id: null }));

    await request(app.getHttpServer())
      .get('/sample/cqrs/search-cache')
      .expect([
        {
          ..._.omit(user, 'fullName', 'articles'),
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      ]);

    await cacheManager.del('GetCqrsCacheHandler');

    await request(app.getHttpServer())
      .get('/sample/cqrs/search-cache')
      .expect([
        {
          ..._.omit(user, 'fullName', 'articles'),
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        {
          ..._.omit(user2, 'fullName', 'articles'),
          createdAt: user2.createdAt.toISOString(),
          updatedAt: user2.updatedAt.toISOString(),
        },
      ]);
  });
});
