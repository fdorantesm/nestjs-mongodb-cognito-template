import { registerAs } from '@nestjs/config';

import { HttpServerConfiguration } from '@/core/infrastructure/types';

export const serverConfigLoader = registerAs(
  'server',
  (): HttpServerConfiguration => ({
    host: process.env.HOST,
    port: Number.parseInt(process.env.PORT, 10),
  }),
);
