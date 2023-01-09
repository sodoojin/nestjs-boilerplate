import { SetMetadata } from '@nestjs/common';

export interface Permission {
  pid: string;
  permission: PermissionType;
}

export enum PermissionType {
  READ = 1,
  WRITE = 4,
  PRIVACY = 8,
}

export const REQUIRE_PERMISSIONS_KEY = 'require-permissions';
export const RequirePermission = (pid: string, permission: PermissionType) =>
  SetMetadata(REQUIRE_PERMISSIONS_KEY, {
    pid,
    permission,
  } as Permission);
