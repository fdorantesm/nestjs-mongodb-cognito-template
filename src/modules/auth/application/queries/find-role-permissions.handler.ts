import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InjectService } from '@/core/application/inject-service.decorator';
import type { RolePermissionsService } from '@/modules/auth/domain/interfaces/role-permissions.service.interface';
import { ROLE_PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/role-permissions.service.interface';
import { FindRolePermissionsQuery } from '@/modules/auth/domain/queries/find-role-permissions.query';
import type { RolePermissionEntity } from '@/modules/auth/domain/entities/role-permission.entity';

@QueryHandler(FindRolePermissionsQuery)
export class FindRolePermissionsHandler
  implements IQueryHandler<FindRolePermissionsQuery>
{
  constructor(
    @InjectService(ROLE_PERMISSIONS_SERVICE_TOKEN)
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  public async execute(
    query: FindRolePermissionsQuery,
  ): Promise<RolePermissionEntity[]> {
    return this.rolePermissionsService.find(query.filter);
  }
}
