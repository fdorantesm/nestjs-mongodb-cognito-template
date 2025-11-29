import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetIdentityUserQuery } from '@/modules/identity/domain/queries/get-identity-user.query';
import { InjectService } from '@/core/application/inject-service.decorator';
import {
  IdentityService,
  IDENTITY_SERVICE_TOKEN,
} from '@/modules/identity/domain/interfaces/identity.service.interface';

@QueryHandler(GetIdentityUserQuery)
export class GetIdentityUserHandler
  implements IQueryHandler<GetIdentityUserQuery>
{
  constructor(
    @InjectService(IDENTITY_SERVICE_TOKEN)
    private readonly identityService: IdentityService,
  ) {}

  public async execute(query: GetIdentityUserQuery) {
    return this.identityService.getUser(query.username);
  }
}
