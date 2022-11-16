import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInterface } from './types/create-user.interface';
import { hash } from '../../helpers/cipher';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserInterface) {
    const user = this.userRepository.create({
      ...dto,
      password: await hash(dto.password),
    });

    return this.userRepository.save(user);
  }
}
