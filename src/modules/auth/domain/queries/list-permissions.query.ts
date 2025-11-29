import type { FilterQuery } from 'mongoose';

import type { QueryParsedOptions } from '@/core/types/general/query-parsed-options.type';
import type { Permission } from '@/modules/auth/domain/interfaces/permission.interface';

export class ListPermissionsQuery {
  constructor(
    public readonly filter?: FilterQuery<Permission>,
    public readonly options?: QueryParsedOptions,
  ) {}
}
