import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetUserByIdQuery } from '@/modules/users/domain/queries/get-user-by-id.query';
import { InjectService } from '@/core/application/inject-service.decorator';
import type { UsersService } from '@/modules/users/domain/interfaces/users.service.interface';
import { USERS_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/users.service.interface';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @InjectService(USERS_SERVICE_TOKEN)
    private readonly usersService: UsersService,
  ) {}

  public async execute(query: GetUserByIdQuery): Promise<UserEntity> {
    return this.usersService.findOne({ uuid: query.userId });
  }
}
