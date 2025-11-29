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
  collection: 'role_permissions',
  timestamps: true,
  autoIndex: true,
  autoCreate: true,
})
export class RolePermissionDocument extends BaseDocument {
  @Prop({
    required: true,
    type: SchemaTypes.UUID,
    index: true,
    get: (v: Buffer) => toUuid(v),
  })
  public roleId: string;

  @Prop({
    required: true,
    type: SchemaTypes.UUID,
    index: true,
    get: (v: Buffer) => toUuid(v),
  })
  public permissionId: string;
}

export const RolePermissionSchema = SchemaFactory.createForClass(
  RolePermissionDocument,
);

export const RolePermissionModel: ModelDefinition = {
  name: RolePermissionDocument.name,
  schema: RolePermissionSchema,
};
