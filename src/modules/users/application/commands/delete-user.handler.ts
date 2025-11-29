import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { InjectService } from '@/core/application/inject-service.decorator';
import type { UsersService } from '@/modules/users/domain/interfaces/users.service.interface';
import { USERS_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/users.service.interface';
import type { ProfilesService } from '@/modules/users/domain/interfaces/profiles.service.interface';
import { PROFILES_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/profiles.service.interface';
import { DeleteUserCommand } from '@/modules/users/domain/commands/delete-user.command';
import { DeleteIdentityUserCommand } from '@/modules/identity/domain/commands/delete-identity-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectService(USERS_SERVICE_TOKEN)
    private readonly usersService: UsersService,
    @InjectService(PROFILES_SERVICE_TOKEN)
    private readonly profilesService: ProfilesService,
    private readonly commandBus: CommandBus,
  ) {}

  public async execute(command: DeleteUserCommand) {
    const user = await this.usersService.findById(command.userId);

    await this.usersService.delete({ uuid: command.userId });
    await this.profilesService.delete({ userId: command.userId });

    const identityId = user?.getIdentityId();
    if (identityId) {
      await this.commandBus.execute(new DeleteIdentityUserCommand(identityId));
    }
  }
}
