import { CommandBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import { DeleteRoleCommand } from '@/modules/auth/domain/commands/delete-role.command';

@UseCase()
export class DeleteRoleUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(_context: Context, roleId: string) {
    return this.commandBus.execute(new DeleteRoleCommand(roleId));
  }
}
