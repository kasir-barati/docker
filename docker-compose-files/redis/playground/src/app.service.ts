import { Injectable } from '@nestjs/common';
import { RedisService } from './redis';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}

  async getHello(): Promise<string> {
    await this.redisService.set('hello', 'Hello World from Redis!');

    const value = await this.redisService.get('hello');

    return value || 'Hello World!';
  }
}
