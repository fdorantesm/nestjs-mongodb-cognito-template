import { CommandBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { DeleteUserCommand } from '@/modules/users/domain/commands/delete-user.command';

@UseCase()
export class DeleteUserUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public execute(_context: Context, userId: string) {
    return this.commandBus.execute(new DeleteUserCommand(userId));
  }
}
