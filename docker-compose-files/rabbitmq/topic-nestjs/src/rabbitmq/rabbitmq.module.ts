import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import auditLogApiConfig from '../configs/app.config';
import { RabbitmqModuleConfig } from './rabbitmq.config';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule.forFeature(auditLogApiConfig)],
      useClass: RabbitmqModuleConfig,
    }),
  ],
  providers: [RabbitmqService],
  exports: [RabbitMQModule],
})
export class RabbitmqModule {}
