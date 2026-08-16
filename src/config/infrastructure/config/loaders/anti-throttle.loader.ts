import { AntiThrottleConfiguration } from '@/core/infrastructure/types/http/throttles.type';
import { registerAs } from '@nestjs/config';

const parseInterval = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? '', 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  if (parsed < 1000) {
    return parsed * 60 * 1000;
  }
  return parsed;
};

const parseMax = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const antiThrottleConfigLoader = registerAs(
  'antiThrottle',
  (): AntiThrottleConfiguration => {
    const baseMax = parseMax(
      process.env.ANTI_THROTTLE_MAX_REQUEST ?? process.env.RATE_MAX_REQUEST,
      15,
    );
    const baseInterval = parseInterval(
      process.env.ANTI_THROTTLE_INTERVAL ?? process.env.RATE_INTERVAL,
      30 * 60 * 1000,
    );

    return {
      maxRequest: baseMax,
      interval: baseInterval,
      readMaxRequest: parseMax(
        process.env.ANTI_THROTTLE_READ_MAX_REQUEST,
        baseMax * 3,
      ),
      readInterval: parseInterval(
        process.env.ANTI_THROTTLE_READ_INTERVAL,
        baseInterval,
      ),
      writeMaxRequest: parseMax(
        process.env.ANTI_THROTTLE_WRITE_MAX_REQUEST,
        baseMax,
      ),
      writeInterval: parseInterval(
        process.env.ANTI_THROTTLE_WRITE_INTERVAL,
        baseInterval,
      ),
      strictMaxRequest: parseMax(
        process.env.ANTI_THROTTLE_STRICT_MAX_REQUEST,
        10,
      ),
      strictInterval: parseInterval(
        process.env.ANTI_THROTTLE_STRICT_INTERVAL,
        30 * 60 * 1000,
      ),
    };
  },
);
