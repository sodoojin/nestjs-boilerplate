import { AuthenticationFilter } from './authentication.filter';
import * as httpMocks from 'node-mocks-http';
import { AuthenticationException } from '../exceptions/authentication.exception';
import { when } from 'jest-when';
import { memberUrl, url } from '../handlebars-helpers/url';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';

jest.mock('../handlebars-helpers/url', () => ({
  memberUrl: jest.fn(),
  url: jest.fn(),
}));

function callCatch(
  filter: AuthenticationFilter,
  exception: UnauthorizedException,
  message: string,
) {
  const flash = jest.fn();
  const { req, res } = httpMocks.createMocks({
    flash,
  });

  filter.catch(exception, {
    switchToHttp: () => ({
      getRequest: () => req,
      getResponse: () => res,
    }),
  } as any);

  expect(flash).toHaveBeenCalledWith('alertMessage', message);
  expect(res.statusCode).toEqual(302);
  return res;
}

describe('AuthenticationFilter', () => {
  const filter = new AuthenticationFilter();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ajax', async () => {
    const { req, res } = httpMocks.createMocks({
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
    });
    const exception = new AuthenticationException('');

    filter.catch(exception, {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as any);

    expect(res._getStatusCode()).toEqual(401);
  });

  it('웹 request AuthenticationException with redirectUrl', async () => {
    const flash = jest.fn();
    const { req, res } = httpMocks.createMocks({
      flash,
    });
    const message = '오류 메시지';
    const redirectUrl = 'https://example.com/a/b/c';
    const exception = new AuthenticationException(message, redirectUrl);

    filter.catch(exception, {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as any);

    expect(flash).toHaveBeenCalledWith('alertMessage', message);
    expect(res.statusCode).toEqual(302);
    expect(res._getRedirectUrl()).toEqual(redirectUrl);
  });

  it('웹 request AuthenticationException without redirectUrl', async () => {
    const flash = jest.fn();
    const requestUrl = 'https://example/a/b/c';
    const memberRequestUrl = 'https://member.example.com/a/b/c';
    const { req, res } = httpMocks.createMocks({
      url: requestUrl,
      flash,
    });
    const message = '오류 메시지';
    const exception = new AuthenticationException(message);

    when(url).calledWith(requestUrl).mockReturnValue(requestUrl);
    when(memberUrl)
      .calledWith(`/auth/login?referer=${encodeURIComponent(requestUrl)}`)
      .mockReturnValue(memberRequestUrl);

    filter.catch(exception, {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as any);

    expect(flash).toHaveBeenCalledWith('alertMessage', message);
    expect(res.statusCode).toEqual(302);
    expect(res._getRedirectUrl()).toEqual(memberRequestUrl);
  });

  it('웹 request UnauthorizedException with referer and redirectUrl', async () => {
    const message = '오류 메시지';
    const redirectUrl = 'https://example.com/a/b/c';
    const exception = new UnauthorizedException(message, redirectUrl);
    const flash = jest.fn();
    const referer = 'https://example.com/referer';
    const { req, res } = httpMocks.createMocks({
      flash,
      headers: {
        referer,
      },
    });

    filter.catch(exception, {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as any);

    expect(flash).toHaveBeenCalledWith('alertMessage', message);
    expect(res.statusCode).toEqual(302);
    expect(res._getRedirectUrl()).toEqual(referer);
  });

  it('웹 request UnauthorizedException with redirectUrl', async () => {
    const message = '오류 메시지';
    const redirectUrl = 'https://example.com/a/b/c';
    const exception = new UnauthorizedException(message, redirectUrl);
    const res = callCatch(filter, exception, message);

    expect(res._getRedirectUrl()).toEqual(redirectUrl);
  });

  it('웹 request UnauthorizedException without referer and redirectUrl', async () => {
    const message = '오류 메시지';
    const exception = new UnauthorizedException(message);
    const res = callCatch(filter, exception, message);

    expect(res._getRedirectUrl()).toEqual('/');
  });
});
