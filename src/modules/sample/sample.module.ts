import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ValidationModule } from './validation/validation.module';
import { CqrsModule } from './cqrs/cqrs.module';
import { HandlebarModule } from './handlebar/handlebar.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    UserModule,
    ValidationModule,
    CqrsModule,
    HandlebarModule,
    ArticleModule,
  ],
})
export class SampleModule {}
