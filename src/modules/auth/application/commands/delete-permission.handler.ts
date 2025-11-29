import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/permissions.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { DeletePermissionCommand } from '@/modules/auth/domain/commands/delete-permission.command';
import type { PermissionsService } from '@/modules/auth/domain/interfaces/permissions.service.interface';

@CommandHandler(DeletePermissionCommand)
@Injectable()
export class DeletePermissionHandler
  implements ICommandHandler<DeletePermissionCommand>
{
  constructor(
    @InjectService(PERMISSIONS_SERVICE_TOKEN)
    private readonly permissionsService: PermissionsService,
  ) {}

  public async execute(command: DeletePermissionCommand) {
    const { permissionId } = command;

    const permission = await this.permissionsService.findById(permissionId);

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    await this.permissionsService.delete({ uuid: permissionId });

    return { deleted: true };
  }
}
