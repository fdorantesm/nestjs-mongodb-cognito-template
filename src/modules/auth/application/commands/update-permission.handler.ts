import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/permissions.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { UpdatePermissionCommand } from '@/modules/auth/domain/commands/update-permission.command';
import type { PermissionsService } from '@/modules/auth/domain/interfaces/permissions.service.interface';

@CommandHandler(UpdatePermissionCommand)
@Injectable()
export class UpdatePermissionHandler
  implements ICommandHandler<UpdatePermissionCommand>
{
  constructor(
    @InjectService(PERMISSIONS_SERVICE_TOKEN)
    private readonly permissionsService: PermissionsService,
  ) {}

  public async execute(command: UpdatePermissionCommand) {
    const { permissionId, payload } = command;

    const permission = await this.permissionsService.findById(permissionId);

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const updated = await this.permissionsService.update(
      { uuid: permissionId },
      payload,
    );

    return updated;
  }
}
