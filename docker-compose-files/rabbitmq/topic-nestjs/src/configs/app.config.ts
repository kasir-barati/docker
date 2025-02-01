import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { AppConfig } from '../types/app.type';
import { NodeEnv } from '../types/node-env.type';
import { validateEnv } from '../utils/validate-env.util';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends AppConfig {}
  }
}

export default registerAs('appConfigs', (): AppConfig => {
  const validatedEnvs = validateEnv(process.env, EnvironmentVariables);

  return validatedEnvs;
});

class EnvironmentVariables implements AppConfig {
  @IsString()
  RABBITMQ_URL: string;

  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.development;

  @IsInt()
  PORT: number;

  @IsString()
  SWAGGER_PATH: string;
}
