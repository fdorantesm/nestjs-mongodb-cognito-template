import { QueryBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import { GetRolePermissionByIdQuery } from '@/modules/auth/domain/queries/get-role-permission-by-id.query';

@UseCase()
export class GetRolePermissionByIdUseCase implements Executable {
  constructor(private readonly queryBus: QueryBus) {}

  public async execute(_context: Context, rolePermissionId: string) {
    const rolePermission = await this.queryBus.execute(
      new GetRolePermissionByIdQuery(rolePermissionId),
    );

    return rolePermission.toJson();
  }
}
