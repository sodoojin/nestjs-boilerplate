import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VirtualColumn } from '../../../../database/decorators/virtual-column';
import { Article } from '../../article/entities/article.entity';
import { AuthorizableUser } from 'nest-casl';
import { Roles } from '../../../../app.roles';
import { Expose } from 'class-transformer';

@Entity()
export class User implements AuthorizableUser<Roles, number> {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Expose({ groups: ['private'] })
  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VirtualColumn()
  fullName: string;

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];

  roles: Roles[];
}
