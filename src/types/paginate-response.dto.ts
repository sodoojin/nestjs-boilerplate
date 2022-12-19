import { BaseResponseDto } from './base-response.dto';
import { Expose, Type } from 'class-transformer';

export class PaginationMeta {
  @Expose()
  itemCount: number;

  @Expose()
  totalItemCount: number;

  @Expose()
  itemsPerPage: number;

  @Expose()
  totalPages: number;

  @Expose()
  currentPage: number;
}

export abstract class PaginateResponseDto<T> extends BaseResponseDto<T> {
  constructor(data: T, meta: PaginationMeta) {
    super(data);

    this.meta = meta;
  }

  @Expose()
  @Type(() => PaginationMeta)
  meta: PaginationMeta;
}
