import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

import {
  MODULE_OPTIONS_TOKEN,
  type RedisModuleOptions,
} from './redis.module-definition';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: RedisModuleOptions,
  ) {
    this.client = new Redis(this.options.redisUrl, {
      password: this.options.redisPassword,
      lazyConnect: false,
    });

    this.client.on('connect', () => {
      this.logger.log('Redis client connected', {
        context: RedisService.name,
      });
    });

    this.client.on('error', (error: Error) => {
      this.logger.error(`Redis client error: ${error.message}`, {
        context: RedisService.name,
        error,
      });
    });

    this.client.on('close', () => {
      this.logger.warn('Redis connection closed', {
        context: RedisService.name,
      });
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis client disconnected', {
      context: RedisService.name,
    });
  }

  /**
   * Get a value from Redis by key
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, value);
      return;
    }
    await this.client.set(key, value);
  }

  /**
   * @description Delete a key from Redis
   * @returns `true` if the key was deleted, `false` if the key did not exist
   */
  async del(key: string): Promise<boolean> {
    const result = await this.client.del(key);

    if (result === 0) {
      return false;
    }
    return true;
  }
}
