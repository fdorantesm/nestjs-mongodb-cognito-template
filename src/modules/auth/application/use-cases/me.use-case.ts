import { ProfilesService } from './../../infrastructure/services/profiles.service';
import { Logger } from '@nestjs/common';

import { UseCase } from '@/core/application/case.decorator';
import { InjectService } from '@/core/application/inject-service.decorator';
import { InvalidCredentialsException } from '@/core/domain/exceptions/invalid-credentials';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { UsersService } from '@/modules/auth/infrastructure/services/users.service';
import type { UserProfileAggregate } from '@/modules/auth/domain/interfaces/user.interface';

@UseCase()
export class MeUseCase implements Executable {
  constructor(
    @InjectService('UsersService')
    private readonly usersService: UsersService,
    @InjectService('ProfilesService')
    private readonly profilesService: ProfilesService,
  ) {}

  public async execute(
    context: Context,
    identityId: string,
  ): Promise<UserProfileAggregate> {
    Logger.log('MeUseCase', context.requestId);

    const user = await this.usersService.findOne({
      identityId,
    });

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const profile = await this.profilesService.findOne({
      userId: user.getUuid(),
    });

    return {
      ...user.toJson(),
      profile: profile.toJson(),
    };
  }
}
