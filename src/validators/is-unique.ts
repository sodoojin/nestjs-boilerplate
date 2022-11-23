import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

interface Condition {
  where: {
    [key: string]: any;
  };
  except?: {
    [key: string]: any;
  };
}

interface Conditions {
  (dto: any): Condition;
}

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUniqueRule implements ValidatorConstraintInterface {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const [entity, columnName] = validationArguments.constraints;

    const queryBuilder = this.dataSource
      .getRepository(entity)
      .createQueryBuilder('qb');

    if (typeof columnName === 'function') {
      const options: Condition = columnName(validationArguments.object);

      Object.keys(options.where).forEach((key, index) => {
        queryBuilder.andWhere(`qb.${key} = :v${index}`, {
          [`v${index}`]: options.where[key],
        });
      });

      Object.keys(options.except ?? {}).forEach((key, index) => {
        queryBuilder.andWhere(`qb.${key} != :ev${index}`, {
          [`ev${index}`]: options.except[key],
        });
      });
    } else {
      queryBuilder.where(`${columnName} = :value`, {
        value,
      });
    }

    return (await queryBuilder.getCount()) === 0;
  }
}

export function IsUnique<T>(
  entity: object,
  columnName: string | Conditions,
  validationOptions?: ValidationOptions,
) {
  return function (object: T, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, columnName],
      validator: IsUniqueRule,
    });
  };
}
