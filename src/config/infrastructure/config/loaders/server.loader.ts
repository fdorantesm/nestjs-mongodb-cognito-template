import { registerAs } from '@nestjs/config';

import { HttpServerConfiguration } from '@/core/infrastructure/types';

export const serverConfigLoader = registerAs(
  'server',
  (): HttpServerConfiguration => ({
    host: process.env.HOST,
    port: Number.parseInt(process.env.PORT, 10),
    cors: {
      origins: (() => {
        const raw = process.env.CORS_ORIGINS?.trim();
        if (!raw) return [];
        if (raw === '*') return '*';
        return raw.split(',').map((e) => e.trim());
      })(),
      allowedHeaders: process.env.CORS_ALLOWED_HEADERS
        ? process.env.CORS_ALLOWED_HEADERS.split(',').map((e) => e.trim())
        : [],
      methods: process.env.CORS_METHODS
        ? process.env.CORS_METHODS.split(',').map((e) => e.trim())
        : [],

      credentials: process.env.CORS_CREDENTIALS,
      maxAge: process.env.CORS_MAX_AGE,
    },
  }),
);
