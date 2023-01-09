import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AdminStrategy } from './strategies/admin.strategy';
import { QueryHandlers } from './queries/handlers';
import { MgrUserModule } from '../mgr-user/mgr-user.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [MgrUserModule, PassportModule, CqrsModule],
  providers: [AdminStrategy, ...QueryHandlers],
  exports: [...QueryHandlers],
})
export class AuthModule {}
