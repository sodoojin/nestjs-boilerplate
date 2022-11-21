import {
  BadRequestException,
  HttpStatus,
  ValidationError,
  ValidationPipe as BasePipe,
} from '@nestjs/common';

export class ValidationPipe extends BasePipe {
  createExceptionFactory(): (validationErrors?: ValidationError[]) => unknown {
    return (errors?: ValidationError[]) => {
      if (!errors) {
        return;
      }

      const errorMessages = {};

      errors.forEach((error) => {
        const messages = [];

        Object.keys(error.constraints).forEach((key) => {
          messages.push(error.constraints[key]);
        });

        errorMessages[error.property] = messages;
      });

      return new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: errorMessages,
        error: 'Bad Request',
      });
    };
  }
}
