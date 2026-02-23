import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis';

@Module({
  imports: [
    RedisModule.registerAsync({
      global: true,
      useFactory: () => {
        return {
          redisUrl: process.env.REDIS_URL!,
          redisPassword: process.env.REDIS_PASSWORD,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
