import type { FilterQuery } from 'mongoose';
import { QueryBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import type { QueryParsedOptions } from '@/core/types/general/query-parsed-options.type';
import type { RolePermission } from '@/modules/auth/domain/interfaces/role-permission.interface';
import { ListRolePermissionsQuery } from '@/modules/auth/domain/queries/list-role-permissions.query';

@UseCase()
export class ListRolePermissionsUseCase implements Executable {
  constructor(private readonly queryBus: QueryBus) {}

  public async execute(
    _context: Context,
    filter?: FilterQuery<RolePermission>,
    options?: QueryParsedOptions,
  ) {
    const result = await this.queryBus.execute(
      new ListRolePermissionsQuery(filter, options),
    );

    return {
      ...result,
      items: result.items.map((rolePermission) => rolePermission.toJson()),
    };
  }
}
