import { OneToMany as OneToManyRelation } from 'typeorm';
import 'reflect-metadata';
import { ObjectType } from 'typeorm/common/ObjectType';
import { RelationOptions } from 'typeorm/decorator/options/RelationOptions';

export const VIRTUAL_COLUMN_KEY = Symbol('VIRTUAL_COLUMN_KEY');
export const RELATION_COLUMN_KEY = Symbol('RELATION_COLUMN_KEY');

export function VirtualColumn(name?: string): PropertyDecorator {
  return (target, propertyKey) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, target) || {};

    metaInfo[propertyKey] = name ?? propertyKey;

    Reflect.defineMetadata(VIRTUAL_COLUMN_KEY, metaInfo, target);
  };
}

export function OneToMany<T>(
  typeFunctionOrTarget: string | ((type?: any) => ObjectType<T>),
  inverseSide: string | ((object: T) => any),
  options?: RelationOptions,
): PropertyDecorator {
  return (target, propertyKey) => {
    const metaInfo = Reflect.getMetadata(RELATION_COLUMN_KEY, target) || {};

    metaInfo[propertyKey] = true;

    Reflect.defineMetadata(RELATION_COLUMN_KEY, metaInfo, target);

    const fn = OneToManyRelation(typeFunctionOrTarget, inverseSide, options);

    return fn(target, propertyKey);
  };
}
