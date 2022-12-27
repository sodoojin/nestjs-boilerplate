import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MgrUser } from './entities/mgr-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MgrUser])],
  providers: [],
  exports: [TypeOrmModule],
})
export class MgrUserModule {}
