import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/permissions.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { GetPermissionByIdQuery } from '@/modules/auth/domain/queries/get-permission-by-id.query';
import type { PermissionsService } from '@/modules/auth/domain/interfaces/permissions.service.interface';

@QueryHandler(GetPermissionByIdQuery)
@Injectable()
export class GetPermissionByIdHandler
  implements IQueryHandler<GetPermissionByIdQuery>
{
  constructor(
    @InjectService(PERMISSIONS_SERVICE_TOKEN)
    private readonly permissionsService: PermissionsService,
  ) {}

  public async execute(query: GetPermissionByIdQuery) {
    const { permissionId } = query;

    const permission = await this.permissionsService.findById(permissionId);

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }
}
