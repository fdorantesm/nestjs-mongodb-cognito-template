import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { InjectService } from '@/core/application/inject-service.decorator';
import { GetUserExtrasByUserIdQuery } from '@/modules/users/domain/queries/get-user-extras-by-user-id.query';
import type { UserExtrasService } from '@/modules/users/domain/interfaces/users-extra.service.interface';

@QueryHandler(GetUserExtrasByUserIdQuery)
export class GetUserExtrasByUserIdHandler
  implements IQueryHandler<GetUserExtrasByUserIdQuery>
{
  constructor(
    @InjectService('UserExtrasService')
    private readonly userExtrasService: UserExtrasService,
  ) {}

  public async execute(query: GetUserExtrasByUserIdQuery) {
    Logger.log('GetUserExtrasByUserIdHandler', query.userId);

    const userExtras = await this.userExtrasService.findByUserId(query.userId);

    return userExtras;
  }
}
