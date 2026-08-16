import { QueryHandler, IQueryHandler, QueryBus } from '@nestjs/cqrs';

import { ROLES_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/roles.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { GetRoleByIdQuery } from '@/modules/auth/domain/queries/get-role-by-id.query';
import type { RolesService } from '@/modules/auth/domain/interfaces/roles.service.interface';
import { FindRolePermissionsQuery } from '@/modules/auth/domain/queries/find-role-permissions.query';
import { FindPermissionsQuery } from '@/modules/auth/domain/queries/find-permissions.query';
import type { RolePermissionEntity } from '@/modules/auth/domain/entities/role-permission.entity';
import type { PermissionEntity } from '@/modules/auth/domain/entities/permission.entity';

@QueryHandler(GetRoleByIdQuery)
export class GetRoleByIdHandler implements IQueryHandler<GetRoleByIdQuery> {
  constructor(
    @InjectService(ROLES_SERVICE_TOKEN)
    private readonly rolesService: RolesService,
    private readonly queryBus: QueryBus,
  ) {}

  public async execute(query: GetRoleByIdQuery) {
    const role = await this.rolesService.findOne({ uuid: query.roleId });

    if (!role) {
      return null;
    }

    // Get role permissions
    const rolePermissions = await this.queryBus.execute<RolePermissionEntity[]>(
      new FindRolePermissionsQuery({
        roleId: query.roleId,
      }),
    );

    if (rolePermissions.length === 0) {
      return role;
    }

    // Get permission details
    const permissionIds = rolePermissions.map((rp) => rp.getPermissionId());
    const permissions = await this.queryBus.execute<PermissionEntity[]>(
      new FindPermissionsQuery({
        uuid: { $in: permissionIds } as any,
      }),
    );

    const permissionsData = permissions.map((p) => ({
      uuid: p.getUuid(),
      name: p.getName(),
      code: p.getCode(),
    }));

    role.setPermissions(permissionsData);

    return role;
  }
}
