import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCqrsCommand } from './commands/create-cqrs.command';
import { GetCqrsQuery } from './queries/get-cqrs.query';
import { CreateCqrsDto } from './dto/create-cqrs.dto';
import { SearchCqrsDto } from './dto/search-cqrs.dto';

@Controller('sample/cqrs')
export class CqrsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post()
  public async store(@Body() dto: CreateCqrsDto) {
    return this.commandBus.execute(
      new CreateCqrsCommand(
        dto.firstName,
        dto.lastName,
        dto.email,
        dto.password,
      ),
    );
  }

  @Get('search')
  public async search(@Query() dto: SearchCqrsDto) {
    return this.queryBus.execute(new GetCqrsQuery(dto.email));
  }
}
