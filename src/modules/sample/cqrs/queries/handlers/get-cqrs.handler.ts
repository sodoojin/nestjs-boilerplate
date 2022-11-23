import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCqrsQuery } from '../get-cqrs.query';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../user/entities/user.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetCqrsQuery)
export class GetCqrsHandler implements IQueryHandler<GetCqrsQuery> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async execute(query: GetCqrsQuery): Promise<User[]> {
    let users = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.firstName || user.lastName', 'fullName')
      .where('user.email LIKE :email', {
        email: `%${query.email}%`,
      })
      .getMany();

    users = users.map((user) => {
      // 각 user 별 api 로 가져와야 하는 필드 등을 세팅

      return user;
    });

    return users;
  }
}
