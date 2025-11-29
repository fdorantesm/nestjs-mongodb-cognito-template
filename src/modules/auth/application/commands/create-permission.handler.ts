import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UuidService } from 'nestjs-uuid';

import { PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/permissions.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { CreatePermissionCommand } from '@/modules/auth/domain/commands/create-permission.command';
import type { PermissionsService } from '@/modules/auth/domain/interfaces/permissions.service.interface';

@CommandHandler(CreatePermissionCommand)
@Injectable()
export class CreatePermissionHandler
  implements ICommandHandler<CreatePermissionCommand>
{
  constructor(
    @InjectService(PERMISSIONS_SERVICE_TOKEN)
    private readonly permissionsService: PermissionsService,
    private readonly uuidService: UuidService,
  ) {}

  public async execute(command: CreatePermissionCommand) {
    const { uuid, name, code } = command.payload;

    const permission = await this.permissionsService.create({
      uuid: uuid || this.uuidService.generate(),
      name,
      code,
    });

    return permission;
  }
}
