import { NodeEnv } from './node-env.type';

export interface AppConfig {
  PORT: number;
  NODE_ENV: NodeEnv;
  SWAGGER_PATH: string;
  RABBITMQ_URL: string;
}
