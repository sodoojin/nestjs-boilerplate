import { Injectable } from '@nestjs/common';

@Injectable()
export class CqrsService {
  public async create() {
    console.log(`create method called`);

    return 'result';
  }
}
