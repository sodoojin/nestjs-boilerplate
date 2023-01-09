import { Controller, Get } from '@nestjs/common';
import {
  PermissionType,
  RequirePermission,
} from '../auth/decorators/require-permission.decorator';

@Controller('admin/mgr-user')
export class MgrUserController {
  @Get('auth')
  @RequirePermission('POP33', PermissionType.READ)
  async auth() {
    return {};
  }
}
