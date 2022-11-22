import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { isAjax } from '../helpers/request';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter<BadRequestException> {
  catch(exception: BadRequestException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const errorMessages = exception.getResponse().message;

    if (isAjax(request)) {
      response.status(400).send({
        status: 'fail',
        data: errorMessages,
      });
    } else {
      request.flash('validationErrors', errorMessages);
      request.flash('userOldInputValues', request.body);
      response.redirect(request.headers.referer ?? '/');
    }
  }
}
