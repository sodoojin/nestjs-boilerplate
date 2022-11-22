import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.locals.validationErrors = req.flash('validationErrors')[0] ?? {};
    res.locals.userOldInputValues = req.flash('userOldInputValues')[0] ?? {};

    next();
  }
}
