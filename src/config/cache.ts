import { CacheModuleOptions } from '@nestjs/common/cache/interfaces/cache-module.interface';
import { MemoryStore } from 'cache-manager-memory-store';

function getStore() {
  if (process.env.CACHE_STORE === 'redis') {
  }

  return MemoryStore;
}

export default {
  isGlobal: true,
  store: getStore(),
  host: process.env.CACHE_HOST,
  port: process.env.CACHE_PORT,
} as CacheModuleOptions;
