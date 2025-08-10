import { registerAs } from '@nestjs/config';
import { EnvironmentConfig } from '@/core/infrastructure/types/environment/environment.type';

export const environmentConfigLoader = registerAs(
  'environment',
  (): EnvironmentConfig => ({
    nodeEnv: process.env.NODE_ENV || 'development',
  }),
);
