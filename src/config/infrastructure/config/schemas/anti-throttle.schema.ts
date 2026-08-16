import * as Joi from 'joi';

export const antiThrottleSchema = Joi.object({
  ANTI_THROTTLE_MAX_REQUEST: Joi.number(),
  ANTI_THROTTLE_INTERVAL: Joi.number(),
});
