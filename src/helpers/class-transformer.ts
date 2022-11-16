import {
  ClassTransformer as Transformer,
  ClassTransformOptions,
} from 'class-transformer';
import { TransformerPackage } from '@nestjs/common/interfaces/external/transformer-package.interface';
import { Type } from '@nestjs/common';

export const ClassTransformer = new (class
  extends Transformer
  implements TransformerPackage
{
  classToPlain(
    object: unknown,
    options?: ClassTransformOptions,
  ): Record<string, any> | Record<string, any>[] {
    return this.instanceToPlain(object, options);
  }

  plainToClass<T>(
    cls: Type<T>,
    plain: unknown,
    options?: ClassTransformOptions,
  ): T[] | T {
    /**
     * TODO
     * 컨트롤러에서 @Body @Query를 사용하여 사용자 입력 값을 객체로 받을 때
     * number field 값을 사용자가 입력하지 않았을 경우 0으로 초기화 되어
     * IsNotEmpty 같은 룰을 적용할 수 없음.
     * class-transformer 패키지에 풀 리퀘를 생성하긴 했는데
     * 과연 머지가 될 지..?
     * 안되면 자체적으로 해결해야 함
     * https://github.com/typestack/class-transformer/pull/1390
     */
    return this.plainToInstance(cls, plain, options);
  }
})();
