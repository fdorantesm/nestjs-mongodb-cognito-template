import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetUserCountByEmailQuery } from '@/modules/users/domain/queries/get-user-count-by-email.query';
import { InjectService } from '@/core/application/inject-service.decorator';
import type { UsersService } from '@/modules/users/domain/interfaces/users.service.interface';
import { USERS_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/users.service.interface';

@QueryHandler(GetUserCountByEmailQuery)
export class GetUserCountByEmailHandler
  implements IQueryHandler<GetUserCountByEmailQuery>
{
  constructor(
    @InjectService(USERS_SERVICE_TOKEN)
    private readonly usersService: UsersService,
  ) {}

  public async execute(query: GetUserCountByEmailQuery): Promise<number> {
    return this.usersService.count({ email: query.email });
  }
}
