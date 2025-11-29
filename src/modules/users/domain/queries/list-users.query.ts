import type { Json } from '@/core/domain/json';
import type { QueryParsedOptions } from '@/core/types/general/query-parsed-options.type';

export class ListUsersQuery {
  constructor(
    public readonly filter?: Json,
    public readonly options?: QueryParsedOptions,
  ) {}
}
