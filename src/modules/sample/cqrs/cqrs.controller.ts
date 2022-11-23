import { Controller, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCqrsCommand } from './commands/create-cqrs.command';
import { GetCqrsQuery } from './queries/get-cqrs.query';

@Controller('sample/cqrs')
export class CqrsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get()
  public async index() {
    return this.commandBus.execute(
      new CreateCqrsCommand('이름', '성', 'test@email.com', 'password'),
    );
  }

  @Get('search')
  public async search() {
    return this.queryBus.execute(new GetCqrsQuery('test@email.com'));
  }
}
