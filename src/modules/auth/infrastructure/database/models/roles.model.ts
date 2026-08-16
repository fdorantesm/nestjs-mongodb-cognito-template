import {
  Prop,
  Schema,
  SchemaFactory,
  type ModelDefinition,
} from '@nestjs/mongoose';

import { BaseDocument } from '@/core/infrastructure/models/base-document';

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
    unique: true,
    type: String,
    index: true,
    sparse: true,
  })
  public code: string;
}

export const RoleSchema = SchemaFactory.createForClass(RoleDocument);

// Virtual field for permissions
RoleSchema.virtual('permissions', {
  ref: 'RolePermissionDocument',
  localField: 'uuid',
  foreignField: 'roleId',
  justOne: false,
});

export const RoleModel: ModelDefinition = {
  name: RoleDocument.name,
  schema: RoleSchema,
};
