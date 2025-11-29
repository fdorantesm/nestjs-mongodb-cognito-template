import type { FilterQuery } from 'mongoose';

import type { QueryParsedOptions } from '@/core/types/general/query-parsed-options.type';
import type { RolePermission } from '@/modules/auth/domain/interfaces/role-permission.interface';

export class ListRolePermissionsQuery {
  constructor(
    public readonly filter?: FilterQuery<RolePermission>,
    public readonly options?: QueryParsedOptions,
  ) {}
}
