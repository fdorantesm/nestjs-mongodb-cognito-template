import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { InjectService } from '@/core/application/inject-service.decorator';
import type { IdentityService } from '@/modules/identity/domain/interfaces/identity.service.interface';
import { IDENTITY_SERVICE_TOKEN } from '@/modules/identity/domain/interfaces/identity.service.interface';
import { RespondChallengeCommand } from '@/modules/identity/domain/commands/respond-challenge.command';

@CommandHandler(RespondChallengeCommand)
export class RespondChallengeHandler
  implements ICommandHandler<RespondChallengeCommand>
{
  constructor(
    @InjectService(IDENTITY_SERVICE_TOKEN)
    private readonly identityService: IdentityService,
  ) {}

  public async execute(command: RespondChallengeCommand): Promise<any> {
    return this.identityService.challenge(command.payload);
  }
}
