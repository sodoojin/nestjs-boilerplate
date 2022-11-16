import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { VirtualColumn } from '../../../database/decorators/virtual-column';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  password: string;

  @VirtualColumn()
  fullName: string;
}
