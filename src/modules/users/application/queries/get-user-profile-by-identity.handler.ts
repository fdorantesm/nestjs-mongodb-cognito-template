import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectService } from '@/core/application/inject-service.decorator';
import type { UsersService } from '@/modules/users/domain/interfaces/users.service.interface';
import { USERS_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/users.service.interface';
import type { ProfilesService } from '@/modules/users/domain/interfaces/profiles.service.interface';
import { PROFILES_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/profiles.service.interface';
import { GetUserProfileByIdentityQuery } from '@/modules/users/domain/queries/get-user-profile-by-identity.query';
import type { UserProfileAggregate } from '@/modules/users/domain/interfaces/user.interface';

@QueryHandler(GetUserProfileByIdentityQuery)
export class GetUserProfileByIdentityHandler
  implements IQueryHandler<GetUserProfileByIdentityQuery>
{
  constructor(
    @InjectService(USERS_SERVICE_TOKEN)
    private readonly usersService: UsersService,
    @InjectService(PROFILES_SERVICE_TOKEN)
    private readonly profilesService: ProfilesService,
  ) {}

  public async execute(
    query: GetUserProfileByIdentityQuery,
  ): Promise<UserProfileAggregate> {
    const user = await this.usersService.findOne({
      identityId: query.identityId,
    });

    if (!user) {
      return undefined;
    }

    const profile = await this.profilesService.findOne({
      userId: user.getUuid(),
    });

    return {
      ...user.toJson(),
      profile: profile?.toJson(),
    } as UserProfileAggregate;
  }
}
