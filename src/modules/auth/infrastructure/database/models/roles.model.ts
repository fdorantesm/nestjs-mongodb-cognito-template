import {
  Prop,
  Schema,
  SchemaFactory,
  type ModelDefinition,
} from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

import { BaseDocument } from '@/core/infrastructure/models/base-document';
import { toUuid } from '@/utils/mongo-uuid';

@Schema({
  collection: 'roles',
  timestamps: true,
  autoIndex: true,
  autoCreate: true,
})
export class RoleDocument extends BaseDocument {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  public name: string;

  @Prop({
    required: true,
    type: [SchemaTypes.UUID],
    get: (v: Buffer) => toUuid(v),
  })
  public permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleDocument);

export const RoleModel: ModelDefinition = {
  name: RoleDocument.name,
  schema: RoleSchema,
};
