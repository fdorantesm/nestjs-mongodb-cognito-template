import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { DeleteIdentityUserCommand } from '@/modules/identity/domain/commands/delete-identity-user.command';
import { InjectService } from '@/core/application/inject-service.decorator';
import {
  IdentityService,
  IDENTITY_SERVICE_TOKEN,
} from '@/modules/identity/domain/interfaces/identity.service.interface';

@CommandHandler(DeleteIdentityUserCommand)
export class DeleteIdentityUserHandler
  implements ICommandHandler<DeleteIdentityUserCommand>
{
  constructor(
    @InjectService(IDENTITY_SERVICE_TOKEN)
    private readonly identityService: IdentityService,
  ) {}

  public async execute(command: DeleteIdentityUserCommand) {
    await this.identityService.deleteUser(command.username);
  }
}
