import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ROLES_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/roles.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { UpdateRoleCommand } from '@/modules/auth/domain/commands/update-role.command';
import type { RolesService } from '@/modules/auth/domain/interfaces/roles.service.interface';

@CommandHandler(UpdateRoleCommand)
@Injectable()
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    @InjectService(ROLES_SERVICE_TOKEN)
    private readonly rolesService: RolesService,
  ) {}

  public async execute(command: UpdateRoleCommand) {
    const { roleId, payload } = command;

    const role = await this.rolesService.findById(roleId);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const updated = await this.rolesService.update({ uuid: roleId }, payload);

    return updated;
  }
}
