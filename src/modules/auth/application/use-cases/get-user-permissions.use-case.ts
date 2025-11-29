import { Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { GetUserPermissionsQuery } from '@/modules/auth/domain/queries/get-user-permissions.query';

@UseCase()
export class GetUserPermissionsUseCase implements Executable {
  constructor(private readonly queryBus: QueryBus) {}

  public async execute(context: Context, identityId: string) {
    Logger.log('GetUserPermissionsUseCase', context.requestId);

    const permissions = await this.queryBus.execute(
      new GetUserPermissionsQuery(identityId),
    );

    return permissions;
  }
}
