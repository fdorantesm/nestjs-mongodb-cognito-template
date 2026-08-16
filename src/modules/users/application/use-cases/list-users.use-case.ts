import { QueryBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Json } from '@/core/domain/json';
import type { QueryParsedOptions } from '@/core/types/general/query-parsed-options.type';
import { ListUsersQuery } from '@/modules/users/domain/queries/list-users.query';

@UseCase()
export class ListUsersUseCase implements Executable {
  constructor(private readonly queryBus: QueryBus) {}

  public async execute(
    _context: Context,
    filter?: Json,
    options?: QueryParsedOptions,
  ) {
    const result = await this.queryBus.execute(
      new ListUsersQuery(filter, options),
    );

    return {
      ...result,
      items: result.items.map((user) => user.toJson()),
    };
  }
}
