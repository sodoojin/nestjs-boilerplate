import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { faker } from '@faker-js/faker/locale/ko';

const mockUserService = () => ({
  create: jest.fn(),
});

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService(),
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('store', async () => {
    const dto = new CreateUserDto();

    dto.firstName = faker.name.firstName();
    dto.lastName = faker.name.lastName();
    dto.password = 'password';
    dto.email = faker.internet.email();

    await controller.store(dto);

    expect(userService.create).toHaveBeenCalledWith({
      ...dto,
    });
  });
});
