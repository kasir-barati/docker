import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import {
  TOPIC_EXCHANGE,
  USER_CREATED_ROUTING_KEY,
  USER_DELETED_ROUTING_KEY,
} from './constants/app.constant';
import { randomUUID } from 'crypto';
import { generateRandomString } from './utils/generate-random-string.util';

@Injectable()
export class AppService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async createUser() {
    const user = await Promise.resolve({
      id: randomUUID(),
      email: generateRandomString(),
    });

    // Publishes message to this routing key: user.created, no need to specify queue.
    await this.amqpConnection.publish(
      TOPIC_EXCHANGE,
      USER_CREATED_ROUTING_KEY,
      user,
    );

    return user;
  }

  async deleteUser() {
    await this.amqpConnection.publish(
      TOPIC_EXCHANGE,
      USER_DELETED_ROUTING_KEY,
      randomUUID(),
    );
  }
}
