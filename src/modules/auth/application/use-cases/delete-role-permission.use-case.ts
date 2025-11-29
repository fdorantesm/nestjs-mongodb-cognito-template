import { CommandBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import { DeleteRolePermissionCommand } from '@/modules/auth/domain/commands/delete-role-permission.command';

@UseCase()
export class DeleteRolePermissionUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(_context: Context, rolePermissionId: string) {
    return this.commandBus.execute(
      new DeleteRolePermissionCommand(rolePermissionId),
    );
  }
}
