import { Context } from '@/core/domain/interfaces/context.interface';

export interface ResourceProps {
  uuid: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  isActive?: boolean;
  isDeleted?: boolean;
  context?: Context;
}
