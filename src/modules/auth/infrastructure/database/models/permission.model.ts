import {
  Prop,
  Schema,
  SchemaFactory,
  type ModelDefinition,
} from '@nestjs/mongoose';

import { BaseDocument } from '@/core/infrastructure/models/base-document';

@Schema({
  collection: 'permissions',
  timestamps: true,
  autoIndex: true,
  autoCreate: true,
})
export class PermissionDocument extends BaseDocument {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  public name: string;

  @Prop({
    required: true,
    type: String,
    unique: true,
    index: true,
  })
  public code: string;
}

export const PermissionSchema =
  SchemaFactory.createForClass(PermissionDocument);

export const PermissionModel: ModelDefinition = {
  name: PermissionDocument.name,
  schema: PermissionSchema,
};
