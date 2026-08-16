import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { CreateIdentityUserCommand } from '@/modules/identity/domain/commands/create-identity-user.command';
import { InjectService } from '@/core/application/inject-service.decorator';
import {
  IdentityService,
  IDENTITY_SERVICE_TOKEN,
} from '@/modules/identity/domain/interfaces/identity.service.interface';

@CommandHandler(CreateIdentityUserCommand)
export class CreateIdentityUserHandler
  implements ICommandHandler<CreateIdentityUserCommand>
{
  constructor(
    @InjectService(IDENTITY_SERVICE_TOKEN)
    private readonly identityService: IdentityService,
  ) {}

  public async execute(command: CreateIdentityUserCommand) {
    return this.identityService.createUser({
      email: command.email,
      password: command.password,
      temporaryPassword: command.temporaryPassword,
      name: command.name,
      phone: command.phone,
      attributes: command.attributes,
      suppressInvitation: command.suppressInvitation,
      enabled: command.enabled,
    });
  }
}
