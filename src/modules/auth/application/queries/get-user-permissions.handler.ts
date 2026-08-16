import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { GetUserPermissionsQuery } from '@/modules/auth/domain/queries/get-user-permissions.query';
import { InjectService } from '@/core/application/inject-service.decorator';
import { USERS_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/users.service.interface';
import type { UsersService } from '@/modules/users/domain/interfaces/users.service.interface';
import { ROLE_PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/role-permissions.service.interface';
import type { RolePermissionsService } from '@/modules/auth/domain/interfaces/role-permissions.service.interface';
import { PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/permissions.service.interface';
import type { PermissionsService } from '@/modules/auth/domain/interfaces/permissions.service.interface';

@QueryHandler(GetUserPermissionsQuery)
export class GetUserPermissionsHandler
  implements IQueryHandler<GetUserPermissionsQuery>
{
  constructor(
    @InjectService(USERS_SERVICE_TOKEN)
    private readonly usersService: UsersService,
    @InjectService(ROLE_PERMISSIONS_SERVICE_TOKEN)
    private readonly rolePermissionsService: RolePermissionsService,
    @InjectService(PERMISSIONS_SERVICE_TOKEN)
    private readonly permissionsService: PermissionsService,
  ) {}

  public async execute(query: GetUserPermissionsQuery) {
    Logger.log('GetUserPermissionsHandler', query.identityId);

    const user = await this.usersService.findOne({
      identityId: query.identityId,
    });

    if (!user) {
      return [];
    }

    const rolePermissions = await this.rolePermissionsService.findByRoleId(
      user.toJson().roleId,
    );

    if (!rolePermissions || rolePermissions.length === 0) {
      return [];
    }

    const permissionIds = rolePermissions.map((rp) => rp.getPermissionId());
    const permissions =
      await this.permissionsService.findManyByUuids(permissionIds);

    return permissions.map((p) => p.toJson());
  }
}
