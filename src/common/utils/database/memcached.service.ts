import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MemcachedService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async get(key: string): Promise<string> {
    return this.cacheManager.get(key);
  }

  async set(
    key: string,
    value: any,
    ttl = this.configService.get('JWT_EXPIRES_IN'),
  ): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    const item = this.get(key);

    item && (await this.cacheManager.del(key));
  }
}
