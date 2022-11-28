import 'express';
import '@nestjs/common';
import { CustomDecorator, HttpException } from '@nestjs/common';
import { HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception';
import { AnyClass, AnyObject } from '@casl/ability/dist/types/types';
import { AuthorizableRequest } from 'nest-casl/dist/interfaces/request.interface';
import {
  SubjectBeforeFilterHook,
  SubjectBeforeFilterTuple,
} from 'nest-casl/dist/interfaces/hooks.interface';

declare module 'nest-casl' {
  export declare function UseAbility<
    Subject = AnyObject,
    Request = AuthorizableRequest,
  >(
    action: string,
    subject: AnyClass<Subject>,
    subjectHook?:
      | AnyClass<SubjectBeforeFilterHook<Subject, Request>>
      | SubjectBeforeFilterTuple<Subject, Request>
      | string,
  ): CustomDecorator;
}

declare module 'express' {
  interface Request {
    device: {
      type: 'desktop' | 'phone' | 'tablet' | 'tv' | 'bot' | 'car';
    };
    flash: CallableFunction;
  }

  interface Response {
    render: any;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_TYPE: 'mysql' | 'mariadb';
      DB_PORT: number;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    test: string;
  }
}

declare module '@nestjs/common' {
  export declare class BadRequestException extends HttpException {
    constructor(
      objectOrError?: string | object | any,
      descriptionOrOptions?: string | HttpExceptionOptions,
    );

    getResponse(): {
      message: {
        [field: string]: Array<string>;
      };
    };
  }
}
