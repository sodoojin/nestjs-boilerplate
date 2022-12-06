import { Controller, Get, Render } from '@nestjs/common';

@Controller('sample/handlebar')
export class HandlebarController {
  @Get('other-layout')
  @Render('sample/handlebar/layout')
  async otherLayout() {
    return {
      layout: 'layouts/other-layout',
    };
  }

  @Get('layout')
  @Render('sample/handlebar/layout')
  public async layout() {
    return {};
  }
}
