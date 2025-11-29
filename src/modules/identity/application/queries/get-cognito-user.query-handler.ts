import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InjectService } from '@/core/application/inject-service.decorator';
import { GetCognitoUserQuery } from '@/modules/identity/domain/queries/get-cognito-user.query';
import {
  IDENTITY_SERVICE_TOKEN,
  type IdentityService,
} from '@/modules/identity/domain/interfaces/identity.service.interface';
import type { IdentityUser } from '@/modules/identity/domain/types/identity-user.types';

@QueryHandler(GetCognitoUserQuery)
export class GetCognitoUserQueryHandler
  implements IQueryHandler<GetCognitoUserQuery>
{
  constructor(
    @InjectService(IDENTITY_SERVICE_TOKEN)
    private readonly identityService: IdentityService,
  ) {}

  public async execute(query: GetCognitoUserQuery): Promise<IdentityUser> {
    return this.identityService.getUser(query.username);
  }
}
