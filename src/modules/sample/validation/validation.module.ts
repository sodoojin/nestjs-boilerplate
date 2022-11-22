import { Module } from '@nestjs/common';
import { ValidationController } from './validation.controller';

@Module({
  controllers: [ValidationController],
})
export class ValidationModule {}
