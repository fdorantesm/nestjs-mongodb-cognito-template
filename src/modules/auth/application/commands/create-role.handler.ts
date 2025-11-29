import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UuidService } from 'nestjs-uuid';

import { ROLES_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/roles.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { CreateRoleCommand } from '@/modules/auth/domain/commands/create-role.command';
import type { RolesService } from '@/modules/auth/domain/interfaces/roles.service.interface';

@CommandHandler(CreateRoleCommand)
@Injectable()
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
  constructor(
    @InjectService(ROLES_SERVICE_TOKEN)
    private readonly rolesService: RolesService,
    private readonly uuidService: UuidService,
  ) {}

  public async execute(command: CreateRoleCommand) {
    const { uuid, name, code, permissions } = command.payload;

    const role = await this.rolesService.create({
      uuid: uuid || this.uuidService.generate(),
      name,
      code,
      permissions: permissions || [],
    });

    return role;
  }
}
