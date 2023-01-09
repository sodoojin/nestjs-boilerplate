import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { VirtualColumn } from '../../../../database/decorators/virtual-column';
import { MgrGroupMenuRole } from './mgr-group-menu-role.entity';

@Entity()
export class MgrMenu {
  @PrimaryColumn({ name: 'menu_no' })
  menuNo: number;

  @Column()
  pid: string;

  @VirtualColumn('maxRole')
  maxRole: number;

  @Column({ name: 'kor_nm' })
  korName: string;

  @Column({ name: 'eng_nm' })
  engName: string;

  @OneToMany(
    () => MgrGroupMenuRole,
    (mgrGroupMenuRole) => mgrGroupMenuRole.mgrMenu,
  )
  mgrGroupMenuRoles: MgrGroupMenuRole[];
}
