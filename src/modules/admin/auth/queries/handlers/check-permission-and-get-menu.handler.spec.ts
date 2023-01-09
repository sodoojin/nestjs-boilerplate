import { CheckPermissionAndGetMenuHandler } from './check-permission-and-get-menu.handler';
import { CheckPermissionAndGetMenuQuery } from '../check-permission-and-get-menu.query';
import { PermissionType } from '../../decorators/require-permission.decorator';
import { when } from 'jest-when';
import { MgrMenu } from '../../../mgr-user/entities/mgr-menu.entity';

const mockMgrMenuRepository = {
  createQueryBuilder: jest.fn(),
} as any;

const mockBuilder = {
  leftJoin: jest.fn(),
  where: jest.fn(),
  getOne: jest.fn(),
};

describe('CheckPermissionAndGetMenuHandler', () => {
  const handler = new CheckPermissionAndGetMenuHandler(mockMgrMenuRepository);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('execute', async () => {
    const userId = 'userId';
    const menuPid = 'menuPid';
    const permission = PermissionType.READ;
    const repositoryResult = new MgrMenu();
    const query = new CheckPermissionAndGetMenuQuery(
      userId,
      menuPid,
      permission,
    );

    when(mockMgrMenuRepository.createQueryBuilder)
      .calledWith('mgrMenu')
      .mockReturnValue(mockBuilder);

    when(mockBuilder.leftJoin)
      .calledWith('mgrMenu.mgrGroupMenuRoles', 'mgrGroupMenuRoles')
      .mockReturnValue(mockBuilder);
    when(mockBuilder.leftJoin)
      .calledWith('mgrGroupMenuRoles.mgrUserGroup', 'mgrUserGroup')
      .mockReturnValue(mockBuilder);
    when(mockBuilder.where)
      .calledWith(
        'mgrMenu.pid = :pid AND mgrUserGroup.id = :userId AND mgrGroupMenuRoles.role & :role > 0',
        {
          pid: query.menuPid,
          userId: query.userId,
          role: query.permission,
        },
      )
      .mockReturnValue(mockBuilder);
    when(mockBuilder.getOne).mockReturnValue(repositoryResult);

    const result = await handler.execute(query);

    expect(result).toBe(repositoryResult);
  });
});
