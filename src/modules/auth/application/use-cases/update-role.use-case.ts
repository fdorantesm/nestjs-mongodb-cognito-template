import { CommandBus } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import {
  UpdateRoleCommand,
  type UpdateRolePayload,
} from '@/modules/auth/domain/commands/update-role.command';

@UseCase()
export class UpdateRoleUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(
    _context: Context,
    roleId: string,
    payload: UpdateRolePayload,
  ) {
    const role = await this.commandBus.execute(
      new UpdateRoleCommand(roleId, payload),
    );

    if (!role) {
      throw new InternalServerErrorException(
        'Role update did not return an entity',
      );
    }

    return role.toJson();
  }
}
