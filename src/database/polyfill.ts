import 'reflect-metadata';
import { SelectQueryBuilder } from 'typeorm';
import {
  RELATION_COLUMN_KEY,
  VIRTUAL_COLUMN_KEY,
} from './decorators/virtual-column';

function mapVirtualColumn(entity: any, item: any) {
  const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entity) ?? {};
  const relationMetaInfo =
    Reflect.getMetadata(RELATION_COLUMN_KEY, entity) ?? {};

  for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
    entity[propertyKey] = item[name];
  }

  for (const propertyKey of Object.keys(relationMetaInfo)) {
    if (Array.isArray(entity[propertyKey])) {
      entity[propertyKey] = entity[propertyKey].map((e) =>
        mapVirtualColumn(e, item),
      );
    } else {
      entity[propertyKey] = mapVirtualColumn(entity, item);
    }
  }

  return entity;
}

SelectQueryBuilder.prototype.getMany = async function () {
  const { entities, raw } = await this.getRawAndEntities();

  const items = entities.map((entity, index) => {
    const item = raw[index];

    return mapVirtualColumn(entity, item);
  });

  return [...items];
};

SelectQueryBuilder.prototype.getOne = async function () {
  const { entities, raw } = await this.getRawAndEntities();
  if (entities.length === 0) return null;

  const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entities[0]) ?? {};

  for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
    entities[0][propertyKey] = raw[0][name];
  }

  return entities[0];
};

SelectQueryBuilder.prototype.paginate = async function (
  page: number,
  limit: number,
  keyColumn: string,
) {
  if (page <= 0) page = 1;

  const newQuery = this.clone()
    .take(limit)
    .offset(limit * (page - 1));

  const totalItemCount = await newQuery.getCount();
  const items = await newQuery.getRawMany();
  const itemKeys = items.map((entity) => entity[keyColumn]);

  return {
    itemKeys,
    meta: {
      itemCount: itemKeys.length,
      totalItemCount,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItemCount / limit),
      currentPage: page,
    },
  };
};
