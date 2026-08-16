import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { InjectService } from '@/core/application/inject-service.decorator';
import type { IdentityService } from '@/modules/identity/domain/interfaces/identity.service.interface';
import { IDENTITY_SERVICE_TOKEN } from '@/modules/identity/domain/interfaces/identity.service.interface';
import { ConfirmRegisterCommand } from '@/modules/identity/domain/commands/confirm-register.command';

@CommandHandler(ConfirmRegisterCommand)
export class ConfirmRegisterHandler
  implements ICommandHandler<ConfirmRegisterCommand>
{
  constructor(
    @InjectService(IDENTITY_SERVICE_TOKEN)
    private readonly identityService: IdentityService,
  ) {}

  public async execute(command: ConfirmRegisterCommand): Promise<void> {
    await this.identityService.confirmRegister({
      email: command.email,
      confirmationCode: command.confirmationCode,
    });
  }
}
