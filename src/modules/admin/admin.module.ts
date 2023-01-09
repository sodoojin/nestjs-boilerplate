import { Module } from '@nestjs/common';
import { MgrUserModule } from './mgr-user/mgr-user.module';
import { APP_GUARD } from '@nestjs/core';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { AuthModule } from './auth/auth.module';
import { PermissionGuard } from './auth/guards/permission.guard';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [MgrUserModule, AuthModule, CqrsModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AdminModule {}
