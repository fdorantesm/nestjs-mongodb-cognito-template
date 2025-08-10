import { toUuid } from '@/utils/mongo-uuid';
import { Prop } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export class ResourceDocument extends Document {
  @Prop({
    type: SchemaTypes.UUID,
    required: true,
    unique: true,
    get: (v: Buffer) => toUuid(v),
  })
  public uuid: string;

  @Prop({ type: Boolean })
  public isActive?: boolean;

  @Prop({ type: Date })
  public deletedAt?: Date;

  @Prop({ type: Boolean, default: false })
  public isDeleted?: boolean;
}
