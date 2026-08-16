import { QueryBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import { GetPermissionByIdQuery } from '@/modules/auth/domain/queries/get-permission-by-id.query';

@UseCase()
export class GetPermissionByIdUseCase implements Executable {
  constructor(private readonly queryBus: QueryBus) {}

  public async execute(_context: Context, permissionId: string) {
    const permission = await this.queryBus.execute(
      new GetPermissionByIdQuery(permissionId),
    );

    return permission.toJson();
  }
}
