import { CommandBus } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import {
  CreateRolePermissionCommand,
  type CreateRolePermissionPayload,
} from '@/modules/auth/domain/commands/create-role-permission.command';

@UseCase()
export class CreateRolePermissionUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(
    _context: Context,
    payload: CreateRolePermissionPayload,
  ) {
    const rolePermission = await this.commandBus.execute(
      new CreateRolePermissionCommand(payload),
    );

    if (!rolePermission) {
      throw new InternalServerErrorException(
        'Role permission creation did not return an entity',
      );
    }

    return rolePermission.toJson();
  }
}
