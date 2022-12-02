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
import { User } from '../modules/sample/user/entities/user.entity';
import { ObjectLiteral } from 'typeorm';
import { QueryBuilder } from 'typeorm/query-builder/QueryBuilder';
import { WhereExpressionBuilder } from 'typeorm/query-builder/WhereExpressionBuilder';

declare module 'typeorm' {
  interface PaginateResult {
    itemKeys: Array<any>;
    meta: {
      itemCount: number;
      totalItemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }

  export declare class SelectQueryBuilder<Entity extends ObjectLiteral>
    extends QueryBuilder<Entity>
    implements WhereExpressionBuilder
  {
    paginate(
      page: number,
      perPage: number,
      keyColumn: string,
    ): Promise<PaginateResult>;
  }
}

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
    user: User;
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
