import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MgrUser } from './entities/mgr-user.entity';
import { MgrUserController } from './mgr-user.controller';
import { MgrMenu } from './entities/mgr-menu.entity';
import { MgrUserGroup } from './entities/mgr-user-group.entity';
import { MgrGroupMenuRole } from './entities/mgr-group-menu-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MgrUser,
      MgrMenu,
      MgrUserGroup,
      MgrGroupMenuRole,
    ]),
  ],
  providers: [],
  exports: [TypeOrmModule],
  controllers: [MgrUserController],
})
export class MgrUserModule {}
