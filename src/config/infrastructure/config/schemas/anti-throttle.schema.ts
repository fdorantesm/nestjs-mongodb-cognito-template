import * as Joi from 'joi';

export const antiThrottleSchema = Joi.object({
  ANTI_THROTTLE_MAX_REQUEST: Joi.number(),
  ANTI_THROTTLE_INTERVAL: Joi.number(),
  ANTI_THROTTLE_READ_MAX_REQUEST: Joi.number(),
  ANTI_THROTTLE_READ_INTERVAL: Joi.number(),
  ANTI_THROTTLE_WRITE_MAX_REQUEST: Joi.number(),
  ANTI_THROTTLE_WRITE_INTERVAL: Joi.number(),
  ANTI_THROTTLE_STRICT_MAX_REQUEST: Joi.number(),
  ANTI_THROTTLE_STRICT_INTERVAL: Joi.number(),
  RATE_MAX_REQUEST: Joi.number(),
  RATE_INTERVAL: Joi.number(),
});
