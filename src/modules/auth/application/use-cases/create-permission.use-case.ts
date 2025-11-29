import { CommandBus } from '@nestjs/cqrs';
import { InternalServerErrorException } from '@nestjs/common';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import {
  CreatePermissionCommand,
  type CreatePermissionPayload,
} from '@/modules/auth/domain/commands/create-permission.command';

@UseCase()
export class CreatePermissionUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(_context: Context, payload: CreatePermissionPayload) {
    const permission = await this.commandBus.execute(
      new CreatePermissionCommand(payload),
    );

    if (!permission) {
      throw new InternalServerErrorException(
        'Permission creation did not return an entity',
      );
    }

    return permission.toJson();
  }
}
