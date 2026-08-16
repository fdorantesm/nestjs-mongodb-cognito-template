import { Logger } from '@nestjs/common';

import { UseCase } from '@/core/application/case.decorator';
import { InvalidCredentialsException } from '@/core/domain/exceptions/invalid-credentials';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { UserProfileAggregate } from '@/modules/users/domain/interfaces/user.interface';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserByIdentityQuery } from '@/modules/users/domain/queries/get-user-by-identity.query';
import { GetUserProfileByIdentityQuery } from '@/modules/users/domain/queries/get-user-profile-by-identity.query';

@UseCase()
export class MeUseCase implements Executable {
  constructor(private readonly queryBus: QueryBus) {}

  public async execute(
    context: Context,
    identityId: string,
  ): Promise<UserProfileAggregate> {
    Logger.log('MeUseCase', context.requestId);

    const user = await this.queryBus.execute(
      new GetUserByIdentityQuery(identityId) as any,
    );

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const profile = await this.queryBus.execute(
      new GetUserProfileByIdentityQuery(identityId) as any,
    );

    if (!profile || !profile.profile) {
      throw new InvalidCredentialsException();
    }

    return {
      ...user.toJson(),
      profile: profile.profile,
    };
  }
}
