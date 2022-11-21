import 'express';
import '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpExceptionOptions } from '@nestjs/common/exceptions/http.exception';

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
