import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UuidService } from 'nestjs-uuid';

import { ROLE_PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/role-permissions.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { CreateRolePermissionCommand } from '@/modules/auth/domain/commands/create-role-permission.command';
import type { RolePermissionsService } from '@/modules/auth/domain/interfaces/role-permissions.service.interface';

@CommandHandler(CreateRolePermissionCommand)
@Injectable()
export class CreateRolePermissionHandler
  implements ICommandHandler<CreateRolePermissionCommand>
{
  constructor(
    @InjectService(ROLE_PERMISSIONS_SERVICE_TOKEN)
    private readonly rolePermissionsService: RolePermissionsService,
    private readonly uuidService: UuidService,
  ) {}

  public async execute(command: CreateRolePermissionCommand) {
    const { uuid, roleId, permissionId } = command.payload;

    const rolePermission = await this.rolePermissionsService.create({
      uuid: uuid || this.uuidService.generate(),
      roleId,
      permissionId,
    });

    return rolePermission;
  }
}
