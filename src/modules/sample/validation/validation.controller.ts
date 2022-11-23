import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { ValidDto } from './dto/valid.dto';
import { UniqueDto } from './dto/unique.dto';
import { UniqueComplexDto } from './dto/unique-complex.dto';

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

  @Post('is-unique')
  public async isUnique(@Body() dto: UniqueDto) {
    return dto;
  }

  @Post('is-unique-complex')
  public async isUniqueComplex(@Body() dto: UniqueComplexDto) {
    return dto;
  }
}
