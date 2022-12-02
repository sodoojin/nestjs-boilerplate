import { Article } from './entities/article.entity';
import { Permissions, InferSubjects, Actions } from 'nest-casl';
import { Roles } from '../../../app.roles';

type Subjects = InferSubjects<typeof Article>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ can, user }) {
    can(Actions.read, Article);
    can(Actions.update, Article, { userId: user.id });
  },
};
