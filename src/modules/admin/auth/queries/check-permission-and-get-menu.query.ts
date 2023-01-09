import { PermissionType } from '../decorators/require-permission.decorator';

export class CheckPermissionAndGetMenuQuery {
  constructor(
    public readonly userId: string,
    public readonly menuPid: string,
    public readonly permission: PermissionType,
  ) {}
}
