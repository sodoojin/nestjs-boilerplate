import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../sample/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { TokenStrategy } from './strategies/token.strategy';

@Module({
  imports: [forwardRef(() => UserModule), PassportModule],
  providers: [TokenStrategy],
})
export class AuthModule {}
