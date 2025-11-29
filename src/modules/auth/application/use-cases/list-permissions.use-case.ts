import type { FilterQuery } from 'mongoose';
import { QueryBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import type { QueryParsedOptions } from '@/core/types/general/query-parsed-options.type';
import type { Permission } from '@/modules/auth/domain/interfaces/permission.interface';
import { ListPermissionsQuery } from '@/modules/auth/domain/queries/list-permissions.query';

@UseCase()
export class ListPermissionsUseCase implements Executable {
  constructor(private readonly queryBus: QueryBus) {}

  public async execute(
    _context: Context,
    filter?: FilterQuery<Permission>,
    options?: QueryParsedOptions,
  ) {
    const result = await this.queryBus.execute(
      new ListPermissionsQuery(filter, options),
    );

    return {
      ...result,
      items: result.items.map((permission) => permission.toJson()),
    };
  }
}
