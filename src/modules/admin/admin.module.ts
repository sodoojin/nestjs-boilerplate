import { Module } from '@nestjs/common';
import { MgrUserModule } from './mgr-user/mgr-user.module';

@Module({
  imports: [MgrUserModule],
})
export class AdminModule {}
