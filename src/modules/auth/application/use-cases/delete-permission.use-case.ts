import { CommandBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import { DeletePermissionCommand } from '@/modules/auth/domain/commands/delete-permission.command';

@UseCase()
export class DeletePermissionUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(_context: Context, permissionId: string) {
    return this.commandBus.execute(new DeletePermissionCommand(permissionId));
  }
}
