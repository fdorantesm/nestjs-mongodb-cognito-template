import {
  Prop,
  Schema,
  SchemaFactory,
  type ModelDefinition,
} from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

import { BaseDocument } from '@/core/infrastructure/models/base-document';
import { toUuid } from '@/utils/mongo-uuid';
import { UserExtraProvider } from '@/modules/users/domain/enums/user-extra-provider.enum';
import type { Json } from '@/core/domain/json';

@Schema({
  collection: 'users_extra',
  timestamps: true,
  autoIndex: true,
  autoCreate: true,
})
export class UserExtraDocument extends BaseDocument {
  @Prop({
    required: true,
    type: SchemaTypes.UUID,
    get: (v: Buffer) => toUuid(v),
    index: true,
  })
  public userId: string;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(UserExtraProvider),
  })
  public provider: string;

  @Prop({
    required: true,
    type: String,
    index: true,
  })
  public externalId: string;

  @Prop({
    required: false,
    type: Object,
  })
  public externalData?: Json;
}

export const UserExtraSchema = SchemaFactory.createForClass(UserExtraDocument);

UserExtraSchema.index({ userId: 1, provider: 1 }, { unique: true });

export const UserExtraModel: ModelDefinition = {
  name: UserExtraDocument.name,
  schema: UserExtraSchema,
};
