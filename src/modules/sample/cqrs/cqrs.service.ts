import { Injectable } from '@nestjs/common';

@Injectable()
export class CqrsService {
  public async create() {
    return 'result';
  }
}
