import { Query } from '@nestjs/cqrs';
import type { FilterQuery } from 'mongoose';

import type { Permission } from '@/modules/auth/domain/interfaces/permission.interface';
import type { PermissionEntity } from '@/modules/auth/domain/entities/permission.entity';

export class FindPermissionsQuery extends Query<PermissionEntity[]> {
  constructor(public readonly filter: FilterQuery<Permission>) {
    super();
  }
}
