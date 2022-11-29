import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

type CacheableOptions = {
  makeKeyWithParams?: boolean;
  ttl: number;
};

export function Cacheable(key: string, options: CacheableOptions) {
  const CacheManagerInjector = Inject(CACHE_MANAGER);

  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    CacheManagerInjector(target, '_cacheManager');
    const originalMethod = propertyDescriptor.value;

    propertyDescriptor.value = async function (...args: any[]) {
      const cacheManager = this._cacheManager as Cache;
      const cacheKey =
        key + (options.makeKeyWithParams === true ? JSON.stringify(args) : '');

      try {
        let result = await cacheManager.get(cacheKey);
        if (!result) {
          result = await originalMethod.apply(this, args);
          await cacheManager.set(cacheKey, result, options.ttl);
        }

        return result;
      } catch (e) {
        return await originalMethod.apply(this, args);
      }
    };
  };
}
