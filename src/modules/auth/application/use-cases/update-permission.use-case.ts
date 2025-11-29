import { CommandBus } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import {
  UpdatePermissionCommand,
  type UpdatePermissionPayload,
} from '@/modules/auth/domain/commands/update-permission.command';

@UseCase()
export class UpdatePermissionUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(
    _context: Context,
    permissionId: string,
    payload: UpdatePermissionPayload,
  ) {
    const permission = await this.commandBus.execute(
      new UpdatePermissionCommand(permissionId, payload),
    );

    if (!permission) {
      throw new InternalServerErrorException(
        'Permission update did not return an entity',
      );
    }

    return permission.toJson();
  }
}
