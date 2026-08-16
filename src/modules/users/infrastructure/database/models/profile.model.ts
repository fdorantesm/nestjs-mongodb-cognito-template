import {
  Prop,
  Schema,
  SchemaFactory,
  type ModelDefinition,
} from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

import { BaseDocument } from '@/core/infrastructure/models/base-document';
import { toUuid } from '@/utils/mongo-uuid';
import type { Json } from '@/core/domain/json';

@Schema({
  collection: 'profiles',
  timestamps: true,
  autoIndex: true,
  autoCreate: true,
})
export class ProfileDocument extends BaseDocument {
  @Prop({
    required: true,
    unique: true,
    type: SchemaTypes.UUID,
    get: (v: Buffer) => toUuid(v),
  })
  public userId: string;

  @Prop({ required: true, type: String })
  public displayName?: string;

  @Prop({ type: String })
  public avatarUrl?: string;

  @Prop({ type: String })
  public bio?: string;

  @Prop({ type: String })
  public location?: string;

  @Prop({ type: String })
  public website?: string;

  @Prop({ type: Object })
  public socialLinks?: Json;

  @Prop({ type: Date })
  public birthday?: Date;

  @Prop({ type: String })
  public phone?: string;

  @Prop({ type: String })
  public gender?: string;

  @Prop({ type: String })
  public pronouns?: string;

  @Prop({ required: true, type: Boolean })
  public isPublic: boolean;
}

export const ProfileSchema = SchemaFactory.createForClass(ProfileDocument);

export const ProfileModel: ModelDefinition = {
  name: ProfileDocument.name,
  schema: ProfileSchema,
};
