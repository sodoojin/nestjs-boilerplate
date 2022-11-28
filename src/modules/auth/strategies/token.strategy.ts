import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from '../../sample/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationException } from '../../../exceptions/authentication.exception';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy, 'token') {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super();
  }

  async validate(req: Request) {
    const user = await this.userRepository.findOne({ where: {} });

    if (!user) {
      throw new AuthenticationException('로그인을 해주세요');
    }

    return user;
  }
}
