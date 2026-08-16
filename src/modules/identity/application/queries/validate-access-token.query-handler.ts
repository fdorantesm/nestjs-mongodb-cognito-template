import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InjectService } from '@/core/application/inject-service.decorator';
import { ValidateAccessTokenQuery } from '@/modules/identity/domain/queries/validate-access-token.query';
import {
  IDENTITY_SERVICE_TOKEN,
  type IdentityService,
} from '@/modules/identity/domain/interfaces/identity.service.interface';

@QueryHandler(ValidateAccessTokenQuery)
export class ValidateAccessTokenQueryHandler
  implements IQueryHandler<ValidateAccessTokenQuery>
{
  constructor(
    @InjectService(IDENTITY_SERVICE_TOKEN)
    private readonly identityService: IdentityService,
  ) {}

  public async execute(query: ValidateAccessTokenQuery): Promise<any> {
    return this.identityService.validateAccessToken(query.token);
  }
}
