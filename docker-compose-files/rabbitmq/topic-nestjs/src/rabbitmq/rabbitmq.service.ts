import {
  AmqpConnection,
  RabbitPayload,
  RabbitRPC,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger, UsePipes } from '@nestjs/common';
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
import { rabbitmqValidationPipe } from '../constants/rabbitmq-validation-pipe.constant';

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger('AuditLog' + RabbitmqService.name);

  @UsePipes(rabbitmqValidationPipe)
  @RabbitRPC({
    exchange: TOPIC_EXCHANGE,
    queue: AUDIT_LOG_QUEUE,
    routingKey: [CREATED_ROUTING_KEY, UPDATED_ROUTING_KEY, DELETED_ROUTING_KEY],
  })
  async log(@RabbitPayload() payload: any) {
    this.logger.log('Logging info...');
    this.logger.log(payload);
  }

  @UsePipes(rabbitmqValidationPipe)
  @RabbitRPC({
    exchange: TOPIC_EXCHANGE,
    queue: USER_WELCOME_MAIL_QUEUE,
    routingKey: USER_CREATED_ROUTING_KEY,
  })
  async sendWelcomeEmail(@RabbitPayload() payload: any) {
    this.logger.log('Sending email...');
    this.logger.log(payload);
  }

  @UsePipes(rabbitmqValidationPipe)
  @RabbitRPC({
    exchange: TOPIC_EXCHANGE,
    queue: USER_DEREGISTRATION_MAIL_QUEUE,
    routingKey: USER_DELETED_ROUTING_KEY,
  })
  async partingGift(@RabbitPayload() payload: string) {
    this.logger.log('Send parting gift...');
    this.logger.log(payload);
  }
}
