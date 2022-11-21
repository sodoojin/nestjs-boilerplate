import { Request } from 'express';

export function isAjax(request: Request) {
  return request.header('x-requested-with') === 'XMLHttpRequest';
}
