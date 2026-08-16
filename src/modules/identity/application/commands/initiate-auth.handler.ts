import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { InjectService } from '@/core/application/inject-service.decorator';
import type { IdentityService } from '@/modules/identity/domain/interfaces/identity.service.interface';
import { IDENTITY_SERVICE_TOKEN } from '@/modules/identity/domain/interfaces/identity.service.interface';
import { InitiateAuthCommand } from '@/modules/identity/domain/commands/initiate-auth.command';

@CommandHandler(InitiateAuthCommand)
export class InitiateAuthHandler
  implements ICommandHandler<InitiateAuthCommand>
{
  constructor(
    @InjectService(IDENTITY_SERVICE_TOKEN)
    private readonly identityService: IdentityService,
  ) {}

  public async execute(command: InitiateAuthCommand): Promise<any> {
    const response = await this.identityService.initiateAuth(
      command.username,
      command.password,
    );

    return {
      ...response,
      tokenType: 'Bearer',
    };
  }
}
