import { Controller, Get } from '@nestjs/common';

@Controller('sample/article')
export class ArticleController {
  @Get()
  async index() {
    return {};
  }
}
