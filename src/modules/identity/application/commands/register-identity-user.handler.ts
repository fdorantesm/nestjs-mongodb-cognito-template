import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { InjectService } from '@/core/application/inject-service.decorator';
import type { IdentityService } from '@/modules/identity/domain/interfaces/identity.service.interface';
import { IDENTITY_SERVICE_TOKEN } from '@/modules/identity/domain/interfaces/identity.service.interface';
import { RegisterIdentityUserCommand } from '@/modules/identity/domain/commands/register-identity-user.command';

@CommandHandler(RegisterIdentityUserCommand)
export class RegisterIdentityUserHandler
  implements ICommandHandler<RegisterIdentityUserCommand>
{
  constructor(
    @InjectService(IDENTITY_SERVICE_TOKEN)
    private readonly identityService: IdentityService,
  ) {}

  public async execute(command: RegisterIdentityUserCommand): Promise<any> {
    return this.identityService.register({
      email: command.email,
      password: command.password,
      displayName: command.displayName,
      phone: command.phone,
    });
  }
}
