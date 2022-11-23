import { User } from '../../modules/sample/user/entities/user.entity';
import { faker } from '@faker-js/faker';
import { define } from 'cooky-cutter';

export const userFactory = define<User>({
  id: 1,
  firstName: () => faker.name.firstName(),
  lastName: () => faker.name.lastName(),
  email: () => faker.internet.email(),
  password: () => faker.lorem.word(),
  createdAt: () => faker.date.past(),
  updatedAt: () => faker.date.future(),
  fullName: null,
});
