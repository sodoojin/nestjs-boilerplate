import { Expose, Type } from 'class-transformer';

export abstract class BaseResponseDto<T> {
  constructor(data: T) {
    this.data = data;
  }

  @Expose()
  @Type((options) => (options.object as BaseResponseDto<T>).dataType)
  data: T;

  abstract dataType: any;
}
