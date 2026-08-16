import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { InjectService } from '@/core/application/inject-service.decorator';

import { GetUserExtraByProviderQuery } from '@/modules/users/domain/queries/get-user-extra-by-provider.query';
import type { UserExtrasService } from '@/modules/users/domain/interfaces/users-extra.service.interface';
import { USER_EXTRAS_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/users-extra.service.interface';
import type { UserExtra } from '@/modules/users/domain/interfaces/user-extra.interface';

@QueryHandler(GetUserExtraByProviderQuery)
export class GetUserExtraByProviderHandler
  implements IQueryHandler<GetUserExtraByProviderQuery>
{
  constructor(
    @InjectService(USER_EXTRAS_SERVICE_TOKEN)
    private readonly userExtrasService: UserExtrasService,
  ) {}

  public async execute(
    query: GetUserExtraByProviderQuery,
  ): Promise<UserExtra | null> {
    return this.userExtrasService.findByUserIdAndProvider(
      query.userId,
      query.provider,
    );
  }
}
