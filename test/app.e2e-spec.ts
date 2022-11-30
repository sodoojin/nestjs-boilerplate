import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../src/modules/sample/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/locale/ko';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    app = globalThis.app;
    userRepository = app.get(getRepositoryToken(User));
  });

  it('virtual-column', async () => {
    const user = userRepository.create();
    user.firstName = faker.name.firstName();
    user.lastName = faker.name.lastName();
    user.email = faker.internet.email();
    user.password = 'password';

    await userRepository.save(user);

    const selectedUser = await userRepository
      .createQueryBuilder('user')
      .addSelect('user.firstName || " " || user.lastName', 'fullName')
      .getOne();

    expect(selectedUser.fullName).toBe(`${user.firstName} ${user.lastName}`);
  });
});
