import { Logger, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { GetUserExtrasByUserIdQuery } from '@/modules/users/domain/queries/get-user-extras-by-user-id.query';
import { GetUserByIdentityQuery } from '@/modules/users/domain/queries/get-user-by-identity.query';

@UseCase()
export class GetUserExtrasUseCase implements Executable {
  constructor(private readonly queryBus: QueryBus) {}

  public async execute(context: Context, identityId: string) {
    Logger.log('GetUserExtrasUseCase', context.requestId);

    // Get user by identityId
    const user = await this.queryBus.execute(
      new GetUserByIdentityQuery(identityId),
    );

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const userExtras = await this.queryBus.execute(
      new GetUserExtrasByUserIdQuery(user.getUuid()),
    );

    return userExtras;
  }
}
