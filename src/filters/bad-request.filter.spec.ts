import { BadRequestFilter } from './bad-request.filter';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { when } from 'jest-when';

describe('BadRequestExceptionFilter', () => {
  const errorMessages = {
    name: ['이름을 입력해 주세요.'],
    age: ['나이를 입력해 주세요.', '나이는 숫자만 입력 가능합니다.'],
  };
  const header = jest.fn();
  const status = jest.fn();
  const flash = jest.fn();
  const redirect = jest.fn();
  const send = jest.fn();
  const badRequestFilter = new BadRequestFilter();
  const badRequestException = new BadRequestException({
    statusCode: HttpStatus.BAD_REQUEST,
    message: errorMessages,
    error: 'Bad Request',
  });
  const body = 'request-body';
  const referer = 'request-referer';
  let argumentsHost;

  beforeEach(() => {
    jest.clearAllMocks();

    argumentsHost = {
      switchToHttp: () => ({
        getRequest: () => ({
          header,
          flash,
          body,
          headers: {
            referer,
          },
        }),
        getResponse: () => ({
          redirect,
          status,
          send,
        }),
      }),
    };
  });

  it('ajax 호출에서 exception 발생', () => {
    when(header)
      .calledWith('x-requested-with')
      .mockReturnValueOnce('XMLHttpRequest');

    when(status)
      .calledWith(400)
      .mockReturnValue(argumentsHost.switchToHttp().getResponse());

    badRequestFilter.catch(badRequestException, argumentsHost);

    expect(send).toHaveBeenCalledWith({
      status: 'fail',
      data: errorMessages,
    });
  });

  it('일반 request 호출에서 exception 발생', () => {
    when(header).calledWith('x-requested-with').mockReturnValueOnce('');

    badRequestFilter.catch(badRequestException, argumentsHost);

    expect(flash).toHaveBeenCalledWith('validationErrors', errorMessages);
    expect(flash).toHaveBeenCalledWith('userOldInputValues', body);
    expect(redirect).toHaveBeenCalledWith(referer);
  });
});
