import { CommandBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { InternalServerErrorException } from '@/core/domain/exceptions';
import {
  CreateUserCommand,
  type CreateUserPayload,
} from '@/modules/users/domain/commands/create-user.command';

@UseCase()
export class CreateUserUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(_context: Context, payload: CreateUserPayload) {
    const user = await this.commandBus.execute(new CreateUserCommand(payload));

    if (!user) {
      throw new InternalServerErrorException(
        'User creation did not return an entity',
        { email: payload.email },
      );
    }

    return user.toJson();
  }
}
