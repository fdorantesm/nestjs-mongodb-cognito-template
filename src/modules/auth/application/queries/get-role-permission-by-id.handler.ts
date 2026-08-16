import { Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ROLE_PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/role-permissions.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { GetRolePermissionByIdQuery } from '@/modules/auth/domain/queries/get-role-permission-by-id.query';
import type { RolePermissionsService } from '@/modules/auth/domain/interfaces/role-permissions.service.interface';

@QueryHandler(GetRolePermissionByIdQuery)
@Injectable()
export class GetRolePermissionByIdHandler
  implements IQueryHandler<GetRolePermissionByIdQuery>
{
  constructor(
    @InjectService(ROLE_PERMISSIONS_SERVICE_TOKEN)
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  public async execute(query: GetRolePermissionByIdQuery) {
    const { rolePermissionId } = query;

    const rolePermission =
      await this.rolePermissionsService.findById(rolePermissionId);

    if (!rolePermission) {
      throw new NotFoundException('Role permission not found');
    }

    return rolePermission;
  }
}
