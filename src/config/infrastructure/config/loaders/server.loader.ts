import { HttpServerConfiguration } from '@/core/infrastructure/types';
import { registerAs } from '@nestjs/config';

export const serverConfigLoader = registerAs(
  'server',
  (): HttpServerConfiguration => ({
    host: process.env.HOST,
    port: parseInt(process.env.PORT, 10),
  }),
);
