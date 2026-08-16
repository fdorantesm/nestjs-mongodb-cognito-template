import { CommandBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import {
  UpdateUserCommand,
  type UpdateUserPayload,
} from '@/modules/users/domain/commands/update-user.command';
import { UserNotFoundException } from '@/modules/users/domain/exceptions';

@UseCase()
export class UpdateUserUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(
    _context: Context,
    userId: string,
    payload: UpdateUserPayload,
  ) {
    const user = await this.commandBus.execute(
      new UpdateUserCommand(userId, payload),
    );

    if (!user) {
      throw new UserNotFoundException(userId);
    }

    return user.toJson();
  }
}
