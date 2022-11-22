import * as httpMocks from 'node-mocks-http';
import { ValidationMiddleware } from './validation.middleware';
import { when } from 'jest-when';
import { NextFunction, Request, Response } from 'express';

describe('ValidationMiddleware', function () {
  let flash;
  let req: Request;
  let res: Response;
  let next: NextFunction;
  const middleware = new ValidationMiddleware();

  beforeEach(() => {
    flash = jest.fn();
    req = httpMocks.createRequest({
      flash,
    });
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('validation 오류가 없을 때', () => {
    when(flash).calledWith('validationErrors').mockReturnValueOnce([]);
    when(flash).calledWith('userOldInputValues').mockReturnValueOnce([]);

    middleware.use(req, res, next);

    expect(res.locals.validationErrors).toStrictEqual({});
    expect(res.locals.userOldInputValues).toStrictEqual({});
    expect(next).toHaveBeenCalled();
  });

  it('validation 오류가 있을 때', () => {
    when(flash)
      .calledWith('validationErrors')
      .mockReturnValueOnce([
        {
          name: ['이름을 입력해 주세요.'],
          age: ['나이를 입력해 주세요.', '나이는 숫자만 입력 가능합니다.'],
        },
      ]);
    when(flash)
      .calledWith('userOldInputValues')
      .mockReturnValueOnce([
        {
          name: '',
          age: 'abc',
        },
      ]);

    middleware.use(req, res, next);

    expect(res.locals.validationErrors).toStrictEqual({
      name: ['이름을 입력해 주세요.'],
      age: ['나이를 입력해 주세요.', '나이는 숫자만 입력 가능합니다.'],
    });
    expect(res.locals.userOldInputValues).toStrictEqual({
      name: '',
      age: 'abc',
    });
    expect(next).toHaveBeenCalled();
  });
});
