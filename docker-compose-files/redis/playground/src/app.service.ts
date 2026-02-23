import { Injectable } from '@nestjs/common';
import { RedisService } from './redis';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}

  async getHello(): Promise<string> {
    await this.redisService.set('hello', 'Hello World from Redis!');

    const value = await this.redisService.get('hello');
    const res1 = await this.redisService.del('hello');
    const res2 = await this.redisService.del('hello');

    console.log(res1, res2);

    return value || 'Hello World!';
  }
}
