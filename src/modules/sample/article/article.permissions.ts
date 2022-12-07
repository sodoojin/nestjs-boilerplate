import { Article } from './entities/article.entity';
import { Permissions, InferSubjects, Actions } from 'nest-casl';
import { Roles } from '../../../app.roles';
import { User } from '../user/entities/user.entity';

type Subjects = InferSubjects<typeof Article>;

export const permissions: Permissions<Roles, Subjects, Actions, User> = {
  everyone({ can, user }) {
    can(Actions.read, Article);
    can(Actions.update, Article, { userId: user.id });
  },
};
