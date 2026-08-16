import type { FilterQuery } from 'mongoose';
import { QueryBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import type { QueryParsedOptions } from '@/core/types/general/query-parsed-options.type';
import type { Role } from '@/modules/auth/domain/interfaces/role.interface';
import { ListRolesQuery } from '@/modules/auth/domain/queries/list-roles.query';

@UseCase()
export class ListRolesUseCase implements Executable {
  constructor(private readonly queryBus: QueryBus) {}

  public async execute(
    _context: Context,
    filter?: FilterQuery<Role>,
    options?: QueryParsedOptions,
  ) {
    const result = await this.queryBus.execute(
      new ListRolesQuery(filter, options),
    );

    return {
      ...result,
      items: result.items.map((role) => role.toJson()),
    };
  }
}
