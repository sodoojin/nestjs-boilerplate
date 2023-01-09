import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  Permission,
  REQUIRE_PERMISSIONS_KEY,
} from '../decorators/require-permission.decorator';
import { QueryBus } from '@nestjs/cqrs';
import { CheckPermissionAndGetMenuQuery } from '../queries/check-permission-and-get-menu.query';
import { UnauthorizedException } from '../../../../exceptions/unauthorized.exception';
import { hoUrl } from '../../../../handlebars-helpers/url';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector, private queryBus: QueryBus) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission: Permission = this.reflector.getAllAndOverride(
      REQUIRE_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return false;
    }

    const { user } = context.switchToHttp().getRequest();

    const mgrMenu = await this.queryBus.execute(
      new CheckPermissionAndGetMenuQuery(
        user.sub,
        requiredPermission.pid,
        requiredPermission.permission,
      ),
    );

    if (mgrMenu === null) {
      throw new UnauthorizedException('권한이 없습니다.', hoUrl('/login'));
    }

    return true;
  }
}
