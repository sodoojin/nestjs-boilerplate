import * as request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { User } from '../../../src/modules/sample/user/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/locale/ko';

describe('sample/ValidationController (e2e)', () => {
  let app: NestExpressApplication;
  let userRepository: Repository<User>;
  let user: User;

  beforeEach(async () => {
    app = globalThis.app;
    userRepository = app.get(getRepositoryToken(User));

    user = await userRepository.save(
      userRepository.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.lorem.word(),
      }),
    );
  });

  it('/is-unique (POST)', async () => {
    return request(app.getHttpServer())
      .post('/sample/validation/is-unique')
      .set('x-requested-with', 'XMLHttpRequest')
      .send({
        email: user.email,
      })
      .expect(400);
  });

  describe('/is-unique-complex (POST)', () => {
    it('firstName 만 중복', async () => {
      return request(app.getHttpServer())
        .post('/sample/validation/is-unique-complex')
        .set('x-requested-with', 'XMLHttpRequest')
        .send({
          firstName: user.firstName,
          email: '',
          id: 0,
        })
        .expect(201);
    });

    it('firstName, email 중복', async () => {
      return request(app.getHttpServer())
        .post('/sample/validation/is-unique-complex')
        .set('x-requested-with', 'XMLHttpRequest')
        .send({
          firstName: user.firstName,
          email: user.email,
          id: 0,
        })
        .expect(400);
    });

    it('firstName, email 중복이지만 except id', async () => {
      /**
       * update request 일 경우 자기 자신은 unique 에서 제거하기 위한 기능
       */
      return request(app.getHttpServer())
        .post('/sample/validation/is-unique-complex')
        .set('x-requested-with', 'XMLHttpRequest')
        .send({
          firstName: user.firstName,
          email: user.email,
          id: user.id,
        })
        .expect(201);
    });
  });
});
