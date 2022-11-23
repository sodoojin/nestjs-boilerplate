import { Controller, Get, Render } from '@nestjs/common';

@Controller('sample/handlebar')
export class HandlebarController {
  @Get('layout')
  @Render('sample/handlebar/layout')
  public async layout() {
    return {};
  }
}
