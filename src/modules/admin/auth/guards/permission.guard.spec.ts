import {
  PermissionType,
  RequirePermission,
} from '../decorators/require-permission.decorator';
import { when } from 'jest-when';
import { PermissionGuard } from './permission.guard';
import { Reflector } from '@nestjs/core';
import * as httpMocks from 'node-mocks-http';
import { CheckPermissionAndGetMenuQuery } from '../queries/check-permission-and-get-menu.query';
import { MgrMenu } from '../../mgr-user/entities/mgr-menu.entity';
import { UnauthorizedException } from '../../../../exceptions/unauthorized.exception';
import { hoUrl } from '../../../../handlebars-helpers/url';

jest.mock('../../../../handlebars-helpers/url', () => ({
  hoUrl: jest.fn(),
}));

class WithoutPermission {
  async test() {
    return {};
  }
}

@RequirePermission('pid', PermissionType.READ)
class PermissionOnController {
  async test() {
    return {};
  }
}

class PermissionOnMethod {
  @RequirePermission('pid2', PermissionType.WRITE)
  async test() {
    return {};
  }
}

const mockContext = () =>
  ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(),
  } as any);
const mockQueryBus = () =>
  ({
    execute: jest.fn(),
  } as any);

async function callCanActive(
  queryBus,
  context,
  controller: PermissionOnMethod,
  req,
  user,
  menuPid: string,
  permission: PermissionType,
  mgrMenu: MgrMenu,
) {
  const guard = new PermissionGuard(new Reflector(), queryBus);

  when(context.getHandler).mockReturnValue(controller.test);
  when(context.getClass).mockReturnValue(PermissionOnController);
  when(context.switchToHttp).mockReturnValue({ getRequest: () => req });
  when(queryBus.execute)
    .calledWith(
      new CheckPermissionAndGetMenuQuery(user.sub, menuPid, permission),
    )
    .mockReturnValue(mgrMenu);

  const result = await guard.canActivate(context);

  expect(result).toBe(true);
}

describe('PermissionGuard', () => {
  it('no permission', async () => {
    const controller = new WithoutPermission();
    const queryBus = mockQueryBus();
    const context = mockContext();
    const guard = new PermissionGuard(new Reflector(), queryBus);

    when(context.getHandler).mockReturnValue(controller.test);
    when(context.getClass).mockReturnValue(WithoutPermission);

    const result = await guard.canActivate(context);

    expect(result).toEqual(false);
  });

  it('mgrMenu 찾을수 없을 때', async () => {
    const controller = new PermissionOnController();
    const queryBus = mockQueryBus();
    const context = mockContext();
    const user = {
      sub: 'sub',
    };
    const req = httpMocks.createRequest({
      user,
    });
    const guard = new PermissionGuard(new Reflector(), queryBus);

    when(context.getHandler).mockReturnValue(controller.test);
    when(context.getClass).mockReturnValue(PermissionOnController);
    when(context.switchToHttp).mockReturnValue({ getRequest: () => req });
    when(queryBus.execute)
      .calledWith(
        new CheckPermissionAndGetMenuQuery(
          user.sub,
          'pid',
          PermissionType.READ,
        ),
      )
      .mockReturnValue(null);
    when(hoUrl).calledWith('/login').mockReturnValue('/login');

    await expect(async () => {
      await guard.canActivate(context);
    }).rejects.toThrowError(UnauthorizedException);
  });

  it('permission on controller', async () => {
    const controller = new PermissionOnController();
    const queryBus = mockQueryBus();
    const context = mockContext();
    const user = {
      sub: 'sub',
    };
    const req = httpMocks.createRequest({
      user,
    });
    const mgrMenu = new MgrMenu();
    const menuPid = 'pid';
    const permission = PermissionType.READ;

    await callCanActive(
      queryBus,
      context,
      controller,
      req,
      user,
      menuPid,
      permission,
      mgrMenu,
    );
  });

  it('permission on method', async () => {
    const controller = new PermissionOnMethod();
    const queryBus = mockQueryBus();
    const context = mockContext();
    const user = {
      sub: 'sub',
    };
    const req = httpMocks.createRequest({
      user,
    });
    const mgrMenu = new MgrMenu();
    const menuPid = 'pid2';
    const permission = PermissionType.WRITE;

    await callCanActive(
      queryBus,
      context,
      controller,
      req,
      user,
      menuPid,
      permission,
      mgrMenu,
    );
  });
});
