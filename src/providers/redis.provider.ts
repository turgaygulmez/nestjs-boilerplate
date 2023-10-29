import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_PREFIX, GLOBAL_CACHE_TTL } from '../constants';

@Injectable()
export class RedisProvider {
  constructor(@Inject(CACHE_MANAGER) protected readonly cacheManager) {}

  async get(key, parseJSON = false) {
    const data = await this.cacheManager.get(`${CACHE_PREFIX}${key}`);

    if (data && parseJSON) {
      return JSON.parse(data);
    }

    return data;
  }

  async set(key: string, value: any, ttl: number = GLOBAL_CACHE_TTL) {
    await this.cacheManager.set(`${CACHE_PREFIX}${key}`, value, ttl);
  }
}
