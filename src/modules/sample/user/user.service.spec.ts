import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { faker } from '@faker-js/faker/locale/ko';
import { hash } from '../../../helpers/cipher';
import { when } from 'jest-when';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.mock('../../helpers/cipher');

const mockUserRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('create', async () => {
    const dto = {
      firstName: faker.name.fullName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.word.noun(),
    };
    const user = new User(),
      savedUser = new User();
    const hashedPassword = 'hashed';

    when(hash).calledWith(dto.password).mockResolvedValueOnce(hashedPassword);
    when(userRepository.create)
      .calledWith({
        ...dto,
        password: hashedPassword,
      })
      .mockReturnValueOnce(user);
    when(userRepository.save).calledWith(user).mockResolvedValueOnce(savedUser);

    const result = await service.create(dto);

    expect(result).toBe(savedUser);
  });
});
