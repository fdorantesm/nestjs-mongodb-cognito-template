import { Prop } from '@nestjs/mongoose';

import { BaseDocument } from '@/core/infrastructure/models/base-document';

export class AuditDocument extends BaseDocument {
  @Prop({ required: true })
  public createdBy: string;

  @Prop({ required: false })
  public updatedBy?: string;

  public createdAt?: Date;

  public updatedAt?: Date;
}
