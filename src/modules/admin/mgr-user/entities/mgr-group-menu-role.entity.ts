import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MgrUserGroup } from './mgr-user-group.entity';
import { MgrMenu } from './mgr-menu.entity';

@Entity()
export class MgrGroupMenuRole {
  @PrimaryColumn({ name: 'group_no' })
  groupNo: number;

  @PrimaryColumn({ name: 'menu_no' })
  menuNo: number;

  @Column()
  role: number;

  @ManyToOne(() => MgrUserGroup)
  @JoinColumn({ name: 'group_no', referencedColumnName: 'groupNo' })
  mgrUserGroup: MgrUserGroup;

  @ManyToOne(() => MgrMenu, (menu) => menu.mgrGroupMenuRoles)
  @JoinColumn({ name: 'menu_no' })
  mgrMenu: MgrMenu;
}
