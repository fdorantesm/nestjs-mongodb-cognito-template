import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectService } from '@/core/application/inject-service.decorator';
import type { UsersService } from '@/modules/users/domain/interfaces/users.service.interface';
import { USERS_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/users.service.interface';
import { ConfirmUserCommand } from '@/modules/users/domain/commands/confirm-user.command';

@CommandHandler(ConfirmUserCommand)
export class ConfirmUserHandler implements ICommandHandler<ConfirmUserCommand> {
  constructor(
    @InjectService(USERS_SERVICE_TOKEN)
    private readonly usersService: UsersService,
  ) {}

  public async execute(command: ConfirmUserCommand) {
    await this.usersService.update(
      { email: command.email },
      {
        isConfirmed: true,
        isEmailVerified: true,
        updatedAt: new Date(),
      },
    );
  }
}
