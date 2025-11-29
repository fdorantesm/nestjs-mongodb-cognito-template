import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ListUsersQuery } from '@/modules/users/domain/queries/list-users.query';
import { InjectService } from '@/core/application/inject-service.decorator';
import type { UsersService } from '@/modules/users/domain/interfaces/users.service.interface';
import { USERS_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/users.service.interface';
import type { Pagination } from '@/core/domain/pagination';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';

@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery> {
  constructor(
    @InjectService(USERS_SERVICE_TOKEN)
    private readonly usersService: UsersService,
  ) {}

  public async execute(query: ListUsersQuery): Promise<Pagination<UserEntity>> {
    const { filter, options } = query;

    return this.usersService.paginate(filter, options);
  }
}
