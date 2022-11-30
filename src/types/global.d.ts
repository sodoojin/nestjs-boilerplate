import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { ValueProvider } from '@nestjs/common/interfaces/modules/provider.interface';

export {};

declare global {
  interface TestOptions {
    modules?: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >;
    providers?: ValueProvider[];
  }

  // eslint-disable-next-line no-var
  var testing: TestOptions;
}
