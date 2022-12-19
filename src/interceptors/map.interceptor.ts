import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { instanceToPlain } from 'class-transformer';

export class MapInterceptor implements NestInterceptor {
  constructor(private groups?: string[] | undefined) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      map((value) =>
        instanceToPlain(value, {
          strategy: 'excludeAll',
          excludeExtraneousValues: true,
          enableCircularCheck: true,
          groups: this.groups,
        }),
      ),
    );
  }
}
