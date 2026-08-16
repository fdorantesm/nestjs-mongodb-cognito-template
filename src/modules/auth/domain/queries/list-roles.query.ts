import type { FilterQuery } from 'mongoose';

import type { QueryParsedOptions } from '@/core/types/general/query-parsed-options.type';
import type { Role } from '@/modules/auth/domain/interfaces/role.interface';

export class ListRolesQuery {
  constructor(
    public readonly filter?: FilterQuery<Role>,
    public readonly options?: QueryParsedOptions,
  ) {}
}
