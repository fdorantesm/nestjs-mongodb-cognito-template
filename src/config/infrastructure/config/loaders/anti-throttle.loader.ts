import { AntiThrottleConfiguration } from '@/core/infrastructure/types/http/throttles.type';
import { registerAs } from '@nestjs/config';

export const antiThrottleConfigLoader = registerAs(
  'antiThrottle',
  (): AntiThrottleConfiguration => ({
    maxRequest: parseInt(process.env.RATE_MAX_REQUEST, 10) || 15,
    interval: parseInt(process.env.RATE_INTERVAL, 10) || 30,
  }),
);
