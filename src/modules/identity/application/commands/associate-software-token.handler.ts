import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { InjectService } from '@/core/application/inject-service.decorator';
import { AssociateSoftwareTokenCommand } from '@/modules/identity/domain/commands/associate-software-token.command';
import type { IdentityService } from '@/modules/identity/domain/interfaces/identity.service.interface';
import { IDENTITY_SERVICE_TOKEN } from '@/modules/identity/domain/interfaces/identity.service.interface';

@CommandHandler(AssociateSoftwareTokenCommand)
export class AssociateSoftwareTokenHandler
  implements ICommandHandler<AssociateSoftwareTokenCommand>
{
  constructor(
    @InjectService(IDENTITY_SERVICE_TOKEN)
    private readonly identityService: IdentityService,
  ) {}

  public async execute(command: AssociateSoftwareTokenCommand): Promise<any> {
    return this.identityService.associateSoftwareToken(command.session);
  }
}
