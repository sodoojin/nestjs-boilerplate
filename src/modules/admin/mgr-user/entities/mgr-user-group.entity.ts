import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MgrGroupMenuRole } from './mgr-group-menu-role.entity';

@Entity()
export class MgrUserGroup {
  @PrimaryColumn({ name: 'group_no' })
  groupNo: number;

  @PrimaryColumn()
  id: string;

  @OneToMany(() => MgrGroupMenuRole, (role) => role.mgrUserGroup)
  mgrGroupMenuRoles: MgrGroupMenuRole[];
}
