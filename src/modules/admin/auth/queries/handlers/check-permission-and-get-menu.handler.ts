import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CheckPermissionAndGetMenuQuery } from '../check-permission-and-get-menu.query';
import { InjectRepository } from '@nestjs/typeorm';
import { MgrMenu } from '../../../mgr-user/entities/mgr-menu.entity';
import { Repository } from 'typeorm';

@QueryHandler(CheckPermissionAndGetMenuQuery)
export class CheckPermissionAndGetMenuHandler
  implements IQueryHandler<CheckPermissionAndGetMenuQuery>
{
  constructor(
    @InjectRepository(MgrMenu) private mgrMenuRepository: Repository<MgrMenu>,
  ) {}

  async execute(query: CheckPermissionAndGetMenuQuery): Promise<any> {
    return this.mgrMenuRepository
      .createQueryBuilder('mgrMenu')
      .leftJoin('mgrMenu.mgrGroupMenuRoles', 'mgrGroupMenuRoles')
      .leftJoin('mgrGroupMenuRoles.mgrUserGroup', 'mgrUserGroup')
      .where(
        'mgrMenu.pid = :pid AND mgrUserGroup.id = :userId AND mgrGroupMenuRoles.role & :role > 0',
        {
          pid: query.menuPid,
          userId: query.userId,
          role: query.permission,
        },
      )
      .getOne();
  }
}
