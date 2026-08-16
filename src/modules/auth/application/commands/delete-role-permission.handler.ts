import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ROLE_PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/role-permissions.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { DeleteRolePermissionCommand } from '@/modules/auth/domain/commands/delete-role-permission.command';
import type { RolePermissionsService } from '@/modules/auth/domain/interfaces/role-permissions.service.interface';

@CommandHandler(DeleteRolePermissionCommand)
@Injectable()
export class DeleteRolePermissionHandler
  implements ICommandHandler<DeleteRolePermissionCommand>
{
  constructor(
    @InjectService(ROLE_PERMISSIONS_SERVICE_TOKEN)
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  public async execute(command: DeleteRolePermissionCommand) {
    const { rolePermissionId } = command;

    const rolePermission =
      await this.rolePermissionsService.findById(rolePermissionId);

    if (!rolePermission) {
      throw new NotFoundException('Role permission not found');
    }

    await this.rolePermissionsService.delete({ uuid: rolePermissionId });

    return { deleted: true };
  }
}
