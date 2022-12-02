import { define } from 'cooky-cutter';
import { Article } from '../../modules/sample/article/entities/article.entity';
import { faker } from '@faker-js/faker';

export const articleFactory = define<Article>({
  id: null,
  title: () => faker.lorem.word(),
  content: () => faker.lorem.paragraph(),
  image: () => faker.system.filePath(),
  createdAt: () => faker.date.past(),
  updatedAt: () => faker.date.past(),
  userId: null,
  user: null,
});
