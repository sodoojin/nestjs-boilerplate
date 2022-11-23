import { forwardRef, Module } from '@nestjs/common';
import { CqrsController } from './cqrs.controller';
import { CqrsService } from './cqrs.service';
import { CommandHandlers } from './commands/handlers';
// CqrsModule 이름이 겹쳐서 RootModule 로 alias 한 것임. 다른 모듈에서는 as RootModule 필요 없음.
import { CqrsModule as RootModule } from '@nestjs/cqrs';
import { UserModule } from '../user/user.module';
import { QueryHandlers } from './queries/handlers';

@Module({
  imports: [RootModule, forwardRef(() => UserModule)],
  controllers: [CqrsController],
  providers: [CqrsService, ...CommandHandlers, ...QueryHandlers],
})
export class CqrsModule {}
