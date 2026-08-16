import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { UpdateIdentityUserCommand } from '@/modules/identity/domain/commands/update-identity-user.command';
import { InjectService } from '@/core/application/inject-service.decorator';
import {
  IdentityService,
  IDENTITY_SERVICE_TOKEN,
} from '@/modules/identity/domain/interfaces/identity.service.interface';

@CommandHandler(UpdateIdentityUserCommand)
export class UpdateIdentityUserHandler
  implements ICommandHandler<UpdateIdentityUserCommand>
{
  constructor(
    @InjectService(IDENTITY_SERVICE_TOKEN)
    private readonly identityService: IdentityService,
  ) {}

  public async execute(command: UpdateIdentityUserCommand) {
    await this.identityService.updateUser({
      username: command.username,
      attributes: command.attributes,
      password: command.password,
      enabled: command.enabled,
    });
  }
}
