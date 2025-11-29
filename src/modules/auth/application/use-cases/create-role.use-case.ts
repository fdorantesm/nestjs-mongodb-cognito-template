import { CommandBus } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import {
  CreateRoleCommand,
  type CreateRolePayload,
} from '@/modules/auth/domain/commands/create-role.command';

@UseCase()
export class CreateRoleUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(_context: Context, payload: CreateRolePayload) {
    const role = await this.commandBus.execute(new CreateRoleCommand(payload));

    if (!role) {
      throw new InternalServerErrorException(
        'Role creation did not return an entity',
      );
    }

    return role.toJson();
  }
}
