import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ROLE_PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/role-permissions.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { ListRolePermissionsQuery } from '@/modules/auth/domain/queries/list-role-permissions.query';
import type { RolePermissionsService } from '@/modules/auth/domain/interfaces/role-permissions.service.interface';

@QueryHandler(ListRolePermissionsQuery)
@Injectable()
export class ListRolePermissionsHandler
  implements IQueryHandler<ListRolePermissionsQuery>
{
  constructor(
    @InjectService(ROLE_PERMISSIONS_SERVICE_TOKEN)
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  public async execute(query: ListRolePermissionsQuery) {
    const { filter, options } = query;

    const rolePermissions = await this.rolePermissionsService.paginate(
      filter,
      options,
    );

    return rolePermissions;
  }
}
