import { ModuleConfigFactory } from '@golevelup/nestjs-modules';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { ConfigurableModuleOptionsFactory, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import auditLogApiConfig from '../configs/app.config';
import {
  AUDIT_LOG_QUEUE,
  CREATED_ROUTING_KEY,
  DELETED_ROUTING_KEY,
  TOPIC_EXCHANGE,
  UPDATED_ROUTING_KEY,
  USER_CREATED_ROUTING_KEY,
  USER_DELETED_ROUTING_KEY,
  USER_DEREGISTRATION_MAIL_QUEUE,
  USER_WELCOME_MAIL_QUEUE,
} from '../constants/app.constant';

export class RabbitmqModuleConfig
  implements ConfigurableModuleOptionsFactory<RabbitMQConfig, 'create'>
{
  constructor(
    @Inject(auditLogApiConfig.KEY)
    private readonly auditLogApiConfigs: ConfigType<typeof auditLogApiConfig>,
  ) {}

  create(): RabbitMQConfig | Promise<RabbitMQConfig> {
    const { RABBITMQ_URL } = this.auditLogApiConfigs;

    return {
      uri: RABBITMQ_URL,
      exchanges: [
        {
          name: TOPIC_EXCHANGE,
          type: 'topic',
        },
      ],
      queues: [
        {
          name: AUDIT_LOG_QUEUE,
          routingKey: [
            CREATED_ROUTING_KEY,
            UPDATED_ROUTING_KEY,
            DELETED_ROUTING_KEY,
          ],
          createQueueIfNotExists: true,
        },
        {
          name: USER_DEREGISTRATION_MAIL_QUEUE,
          routingKey: USER_DELETED_ROUTING_KEY,
          createQueueIfNotExists: true,
        },
        {
          name: USER_WELCOME_MAIL_QUEUE,
          routingKey: USER_CREATED_ROUTING_KEY,
          createQueueIfNotExists: true,
        },
      ],
      connectionInitOptions: { wait: false },
    };
  }
}
