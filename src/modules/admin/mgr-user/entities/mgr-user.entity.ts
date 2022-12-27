import { Column, Entity, PrimaryColumn } from 'typeorm';
import { YesOrNo } from '../../../../types/YesOrNo.enum';

@Entity()
export class MgrUser {
  @PrimaryColumn()
  id: string;

  @Column()
  passwd: string;

  @Column({ name: 'com_idx' })
  comIdx: number;

  @Column()
  grade: string;

  @Column()
  name: string;

  @Column()
  part: string;

  @Column({ name: 'posi' })
  position: string;

  @Column()
  tel: string;

  @Column({ name: 'exttel' })
  extraTel: string;

  @Column()
  email: string;

  @Column()
  messenger: string;

  @Column({ name: 'messenger_email' })
  messengerEmail: string;

  @Column({ name: 'inventory_com' })
  inventoryCom: string;

  @Column({ name: 'use_yn' })
  useYn: YesOrNo;

  @Column({ name: 'md_yn' })
  mdYn: YesOrNo;

  @Column({ name: 'cs_yn' })
  csYn: YesOrNo;

  @Column({ name: 'warehouse_yn' })
  warehouseYn: YesOrNo;

  @Column({ name: 'lookbook_yn' })
  lookbookYn: YesOrNo;

  @Column({ name: 'regi_date' })
  createdAt: Date;

  @Column({ name: 'visit_cnt' })
  visitedCount: number;

  @Column({ name: 'visit_ip' })
  visitedIp: string;

  @Column({ name: 'fail_cnt' })
  failedCount: number;

  @Column({ name: 'fail_dt' })
  failedDate: Date;

  @Column({ name: 'fail_limit_dt' })
  loginBlockedTo: Date;

  @Column({ name: 'skin_no' })
  skinNo: number;

  @Column()
  language: string;

  @Column({ name: 'iptype' })
  ipType: string;

  @Column({ name: 'ipfrom' })
  ipFrom: string;

  @Column({ name: 'ipto' })
  ipTo: string;

  @Column({ name: 'pwchgperiod' })
  passwordExpiryPeriod: number;

  @Column({ name: 'pwchgdate' })
  passwordChangedAt: Date;

  @Column({ name: 'pw_issue_dt' })
  passwordIssuedAt: Date;

  @Column({ name: 'otp_yn' })
  otpYn: YesOrNo;

  @Column({ name: 'otp_key' })
  otpKey: string;

  @Column({ name: 'otp_ut' })
  otpUpdatedAt: Date;

  @Column({ name: 'otp_hp_st' })
  otpCodeSentAt: Date;

  @Column({ name: 'opt_login_yn' })
  optLoginYn: YesOrNo;

  @Column({ name: 'otp_certify_dt' })
  otpCertifiedAt: Date;

  @Column({ name: 'otp_hp_cnt' })
  otpCodeSentCount: number;

  @Column({ name: 'device_limit_yn' })
  deviceLimitYn: YesOrNo;

  @Column({ name: 'device_pc_key' })
  devicePcKey: YesOrNo;

  @Column({ name: 'device_pc_agent' })
  devicePcAgent: YesOrNo;

  @Column({ name: 'device_pc_ut' })
  devicePcUpdatedAt: Date;

  @Column({ name: 'device_pc_hp_st' })
  devicePcHpSentAt: Date;

  @Column({ name: 'device_mb_key' })
  deviceMbKey: string;

  @Column({ name: 'device_mb_agent' })
  deviceMbAgent: string;

  @Column({ name: 'device_mb_ut' })
  deviceMbUpdatedAt: Date;

  @Column({ name: 'device_mb_hp_st' })
  deviceMbHpSentAt: Date;

  @Column({ name: 'push_cnt' })
  pushCount: number;

  @Column({ name: 'ldap_auth_yn' })
  ldapAuthYn: YesOrNo;

  @Column({ name: 'tmall_disp_yn' })
  tmallDisplayYn: YesOrNo;
}
