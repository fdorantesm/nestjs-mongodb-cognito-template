import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetUserByIdentityQuery } from '@/modules/users/domain/queries/get-user-by-identity.query';
import { InjectService } from '@/core/application/inject-service.decorator';
import type { UsersService } from '@/modules/users/domain/interfaces/users.service.interface';
import { USERS_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/users.service.interface';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';

@QueryHandler(GetUserByIdentityQuery)
export class GetUserByIdentityHandler
  implements IQueryHandler<GetUserByIdentityQuery>
{
  constructor(
    @InjectService(USERS_SERVICE_TOKEN)
    private readonly usersService: UsersService,
  ) {}

  public async execute(
    query: GetUserByIdentityQuery,
  ): Promise<UserEntity | null> {
    return this.usersService.findOne({ identityId: query.identityId });
  }
}
