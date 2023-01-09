import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { isAjax } from '../helpers/request';
import { Request, Response } from 'express';
import { AuthenticationException } from '../exceptions/authentication.exception';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
import { memberUrl, url } from '../handlebars-helpers/url';

@Catch(AuthenticationException, UnauthorizedException)
export class AuthenticationFilter
  implements ExceptionFilter<AuthenticationException | UnauthorizedException>
{
  catch(
    exception: AuthenticationException | UnauthorizedException,
    host: ArgumentsHost,
  ): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    if (isAjax(request)) {
      response.status(401).send();
    } else {
      request.flash('alertMessage', exception.message);

      if (exception instanceof AuthenticationException) {
        response.redirect(
          exception.redirectUrl ??
            memberUrl(
              `/auth/login?referer=${encodeURIComponent(url(request.url))}`,
            ),
        );
      } else {
        response.redirect(
          request.headers.referer ?? exception.redirectUrl ?? '/',
        );
      }
    }
  }
}
