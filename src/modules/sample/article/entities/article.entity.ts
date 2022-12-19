import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Expose, Type } from 'class-transformer';
import { image } from '../../../../handlebars-helpers/url';

@Entity()
export class Article {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column()
  title: string;

  @Expose()
  @Column()
  content: string;

  @Column()
  image: string;

  @Expose({ name: 'image' })
  imageWithDomain() {
    return image(this.image);
  }

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;

  @Expose()
  @Type(() => User)
  @ManyToOne(() => User, (user) => user.articles)
  user: User;
  @Column()
  userId: number;
}
