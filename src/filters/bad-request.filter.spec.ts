import { BadRequestFilter } from './bad-request.filter';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import * as httpMocks from 'node-mocks-http';

describe('BadRequestExceptionFilter', () => {
  const errorMessages = {
    name: ['이름을 입력해 주세요.'],
    age: ['나이를 입력해 주세요.', '나이는 숫자만 입력 가능합니다.'],
  };
  const badRequestFilter = new BadRequestFilter();
  const badRequestException = new BadRequestException({
    statusCode: HttpStatus.BAD_REQUEST,
    message: errorMessages,
    error: 'Bad Request',
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ajax 호출에서 exception 발생', () => {
    const { req, res } = httpMocks.createMocks({
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
    });

    badRequestFilter.catch(badRequestException, {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as any);

    expect(res.statusCode).toEqual(400);
    expect(res._getData()).toEqual({
      status: 'fail',
      data: errorMessages,
    });
  });

  it('일반 request 호출에서 exception 발생 referer 없음', () => {
    const flash = jest.fn();
    const body = {
      req1: 'req1',
      req2: 'req2',
    };
    const { req, res } = httpMocks.createMocks(
      {
        flash,
        body,
      },
      {},
    );

    badRequestFilter.catch(badRequestException, {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as any);

    expect(flash).toHaveBeenCalledWith('validationErrors', errorMessages);
    expect(flash).toHaveBeenCalledWith('userOldInputValues', body);
    expect(res._getRedirectUrl()).toEqual('/');
  });

  it('일반 request 호출에서 exception 발생 referer 있음', () => {
    const flash = jest.fn();
    const body = {
      req1: 'req1',
      req2: 'req2',
    };
    const referer = 'https://example.com/a/b/c';
    const { req, res } = httpMocks.createMocks(
      {
        headers: {
          referer,
        },
        flash,
        body,
      },
      {},
    );

    badRequestFilter.catch(badRequestException, {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
    } as any);

    expect(flash).toHaveBeenCalledWith('validationErrors', errorMessages);
    expect(flash).toHaveBeenCalledWith('userOldInputValues', body);
    expect(res._getRedirectUrl()).toEqual(referer);
  });
});
