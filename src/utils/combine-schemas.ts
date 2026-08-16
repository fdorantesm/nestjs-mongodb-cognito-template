import * as Joi from 'joi';

export function combineSchemas(schemas: Joi.ObjectSchema[]) {
  return schemas.reduce((combined, current) => combined.concat(current), Joi.object());
}
