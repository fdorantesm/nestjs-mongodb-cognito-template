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
  collection: 'users',
  timestamps: true,
  autoIndex: true,
  autoCreate: true,
})
export class UserDocument extends BaseDocument {
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  public identityId: string;

  @Prop({
    required: true,
    type: String,
  })
  public username?: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  public email: string;

  @Prop({
    required: true,
    type: SchemaTypes.UUID,
    get: (v: Buffer) => toUuid(v),
  })
  public roleId: string;

  @Prop({
    required: true,
    type: [String],
  })
  public scopes: string[];

  @Prop({
    required: true,
    type: Boolean,
  })
  public isConfirmed: boolean;

  @Prop({
    required: true,
    type: Boolean,
  })
  public isEmailVerified: boolean;

  @Prop({
    required: true,
    type: Boolean,
  })
  public isPhoneVerified: boolean;

  @Prop({
    required: true,
    type: Boolean,
  })
  public isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

export const UserModel: ModelDefinition = {
  name: UserDocument.name,
  schema: UserSchema,
};
