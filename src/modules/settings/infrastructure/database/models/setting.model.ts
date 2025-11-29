import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from '@/core/infrastructure/models/base-document';
import { Setting } from '../../../domain/interfaces';
import { SettingKey, SettingType } from '../../../domain/enums';

@Schema({
  collection: 'settings',
  autoCreate: true,
  autoIndex: true,
  timestamps: true,
})
export class SettingModel extends BaseDocument implements Setting {
  @Prop({
    required: true,
    unique: true,
    type: String,
    enum: Object.values(SettingKey),
  })
  key: SettingKey;

  @Prop({ required: true })
  value: string;

  @Prop({ required: true, type: String, enum: Object.values(SettingType) })
  type: SettingType;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true, default: true })
  isPublic: boolean;

  @Prop({ required: false })
  updatedBy?: string;
}

export const SettingSchema = SchemaFactory.createForClass(SettingModel);

// Indexes
SettingSchema.index({ isPublic: 1 });
