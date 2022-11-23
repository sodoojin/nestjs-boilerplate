import { Module } from '@nestjs/common';
import { HandlebarController } from './handlebar.controller';

@Module({
  controllers: [HandlebarController],
})
export class HandlebarModule {}
