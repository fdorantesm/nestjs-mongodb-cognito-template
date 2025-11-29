import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ROLES_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/roles.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { DeleteRoleCommand } from '@/modules/auth/domain/commands/delete-role.command';
import type { RolesService } from '@/modules/auth/domain/interfaces/roles.service.interface';

@CommandHandler(DeleteRoleCommand)
@Injectable()
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand> {
  constructor(
    @InjectService(ROLES_SERVICE_TOKEN)
    private readonly rolesService: RolesService,
  ) {}

  public async execute(command: DeleteRoleCommand) {
    const { roleId } = command;

    const role = await this.rolesService.findById(roleId);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.rolesService.delete({ uuid: roleId });

    return { deleted: true };
  }
}
