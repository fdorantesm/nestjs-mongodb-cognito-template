import * as Joi from 'joi';

export const configSchema = Joi.object({
  HOST: Joi.string().default('localhost'),
  PORT: Joi.number().required().port(),
  CORS_ORIGINS: Joi.string(),
  CORS_METHODS: Joi.string(),
  CORS_ALLOWED_HEADERS: Joi.string(),
  CORS_CREDENTIALS: Joi.boolean(),
  CORS_MAX_AGE: Joi.number(),
});
