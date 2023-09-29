import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '../config/config.service';
import * as memcachedStore from 'cache-manager-memcached-store';
import * as Memcache from 'memcache-pp';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        store: memcachedStore,
        driver: Memcache,
        options: {
          hosts: [
            `${configService.get('CACHE_HOST')}:${configService.get(
              'CACHE_PORT',
            )}`,
          ],
        },
        ttl: +configService.get('CACHE_TTL'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class CacheModuleInstance {}
