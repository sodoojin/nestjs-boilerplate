import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { ValidDto } from './dto/valid.dto';

@Controller('sample/validation')
export class ValidationController {
  @Post()
  public async store(@Body() dto: ValidDto) {
    return dto;
  }

  @Get()
  @Render('sample/validation/index')
  public async index() {
    return {};
  }
}
