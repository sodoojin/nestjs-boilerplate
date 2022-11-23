import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ValidationModule } from './validation/validation.module';
import { CqrsModule } from './cqrs/cqrs.module';

@Module({
  imports: [UserModule, ValidationModule, CqrsModule],
})
export class SampleModule {}
