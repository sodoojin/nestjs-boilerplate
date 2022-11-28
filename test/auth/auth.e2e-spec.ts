import * as request from 'supertest';
import {
  Controller,
  forwardRef,
  Get,
  INestApplication,
  Module,
  UseGuards,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../src/modules/sample/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TokenAuthGuard } from '../../src/modules/auth/guards/token-auth.guard';
import { userFactory } from '../../src/database/factories/user.factory';
import {
  Actions,
  CaslModule,
  CaslSubject,
  InferSubjects,
  Permissions,
  SubjectProxy,
  UseAbility,
} from 'nest-casl';
import { Roles } from '../../src/app.roles';
import { PolicyGuard } from '../../src/modules/auth/guards/policy.guard';
import { UserModule } from '../../src/modules/sample/user/user.module';

type Subjects = InferSubjects<typeof User>;
const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ user, can, cannot }) {
    can(Actions.read, User);
    cannot(Actions.create, User);

    can(Actions.update, User, { id: user.id });
  },
};

@Controller('test/auth')
class TestController {
  @Get()
  @UseGuards(TokenAuthGuard)
  async index() {
    return {};
  }

  @Get('everyone/read')
  @UseGuards(TokenAuthGuard, PolicyGuard)
  @UseAbility(Actions.read, User)
  async everyoneRead() {
    return {};
  }

  @Get('everyone/create')
  @UseGuards(TokenAuthGuard, PolicyGuard)
  @UseAbility(Actions.create, User)
  async everyoneCreate() {
    return {};
  }

  @Get('everyone/update/:id')
  @UseGuards(TokenAuthGuard, PolicyGuard)
  @UseAbility(Actions.update, User, [
    getRepositoryToken(User),
    (repo: Repository<User>, { params }) =>
      repo.findOne({ where: { id: params.id } }),
  ])
  async everyoneUpdate(@CaslSubject() subjectProxy: SubjectProxy<User>) {
    const user = await subjectProxy.get();

    return {};
  }
}

@Module({
  imports: [
    CaslModule.forFeature({ permissions }),
    forwardRef(() => UserModule),
  ],
  controllers: [TestController],
})
class TestModule {}

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(() => {
    global.testingModules = [TestModule];
  });

  beforeEach(() => {
    app = global.app;
    userRepository = app.get(getRepositoryToken(User));
  });

  describe('authentication', () => {
    it('사용자 있음', async () => {
      await userRepository.save(userFactory());

      return request(app.getHttpServer()).get('/test/auth').expect(200);
    });

    it('사용자 없음', async () => {
      return request(app.getHttpServer()).get('/test/auth').expect(302);
    });

    it('사용자 없음 ajax', async () => {
      return request(app.getHttpServer())
        .get('/test/auth')
        .set('x-requested-with', 'XMLHttpRequest')
        .expect(401);
    });
  });

  describe('authorization', () => {
    let user: User;

    beforeEach(async () => {
      user = await userRepository.save(userFactory());
    });

    it('권한 있음', async () => {
      await request(app.getHttpServer())
        .get('/test/auth/everyone/read')
        .expect(200);
    });

    it('권한 없음', async () => {
      await request(app.getHttpServer())
        .get('/test/auth/everyone/create')
        .set('x-requested-with', 'XMLHttpRequest')
        .expect(401);
    });

    it('조건부 권한', async () => {
      const user2 = await userRepository.save(userFactory({ id: null }));

      await request(app.getHttpServer())
        .get(`/test/auth/everyone/update/${user2.id}`)
        .set('x-requested-with', 'XMLHttpRequest')
        .expect(401);

      await request(app.getHttpServer())
        .get(`/test/auth/everyone/update/${user.id}`)
        .set('x-requested-with', 'XMLHttpRequest')
        .expect(200);
    });
  });
});
