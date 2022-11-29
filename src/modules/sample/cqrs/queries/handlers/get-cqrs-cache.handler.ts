import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCqrsCacheQuery } from '../get-cqrs-cache.query';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Cacheable } from '../../../../../decorators/cacheable.decorator';

@QueryHandler(GetCqrsCacheQuery)
export class GetCqrsCacheHandler implements IQueryHandler<GetCqrsCacheQuery> {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  @Cacheable('GetCqrsCacheHandler', { ttl: 60 })
  async execute(query: GetCqrsCacheQuery) {
    return this.userRepository.find({ where: {} });
  }
}
