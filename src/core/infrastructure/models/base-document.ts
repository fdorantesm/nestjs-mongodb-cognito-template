import { toUuid } from '@/utils/mongo-uuid';
import { Prop } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export class BaseDocument extends Document {
  @Prop({
    type: SchemaTypes.UUID,
    required: true,
    unique: true,
    get: (v: Buffer) => toUuid(v),
  })
  public uuid: string;
}
