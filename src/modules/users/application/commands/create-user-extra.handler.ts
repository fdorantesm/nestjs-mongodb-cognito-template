import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectService } from '@/core/application/inject-service.decorator';

import { CreateUserExtraCommand } from '@/modules/users/domain/commands/create-user-extra.command';
import type { UserExtrasService } from '@/modules/users/domain/interfaces/users-extra.service.interface';
import { USER_EXTRAS_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/users-extra.service.interface';
import type { UserExtra } from '@/modules/users/domain/interfaces/user-extra.interface';

@CommandHandler(CreateUserExtraCommand)
export class CreateUserExtraHandler
  implements ICommandHandler<CreateUserExtraCommand>
{
  constructor(
    @InjectService(USER_EXTRAS_SERVICE_TOKEN)
    private readonly userExtrasService: UserExtrasService,
  ) {}

  public async execute(command: CreateUserExtraCommand): Promise<UserExtra> {
    return this.userExtrasService.createIntegration(
      command.userId,
      command.provider,
      command.externalId,
      command.externalData,
    );
  }
}
