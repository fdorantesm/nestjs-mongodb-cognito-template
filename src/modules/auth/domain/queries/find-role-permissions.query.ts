import { Query } from '@nestjs/cqrs';
import type { FilterQuery } from 'mongoose';

import type { RolePermission } from '@/modules/auth/domain/interfaces/role-permission.interface';
import type { RolePermissionEntity } from '@/modules/auth/domain/entities/role-permission.entity';

export class FindRolePermissionsQuery extends Query<RolePermissionEntity[]> {
  constructor(public readonly filter: FilterQuery<RolePermission>) {
    super();
  }
}
