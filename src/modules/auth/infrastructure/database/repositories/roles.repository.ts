import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { Repository } from '@/core/application/repository.decorator';
import { BaseRepository } from '@/core/infrastructure/repositories/base.repository';
import type { Filter } from '@/core/domain/interfaces/filter.interface';
import type { Pagination } from '@/core/domain/pagination';
import { RoleEntity } from '@/modules/auth/domain/entities/role.entity';
import type { Role } from '@/modules/auth/domain/interfaces/role.interface';
import { RoleDocument } from '@/modules/auth/infrastructure/database/models/roles.model';
import { RolePermissionDocument } from '@/modules/auth/infrastructure/database/models/role-permission.model';
import { PermissionDocument } from '@/modules/auth/infrastructure/database/models/permission.model';
import { toUuid } from '@/utils/mongo-uuid';

@Repository()
export class RolesRepository extends BaseRepository<Role, RoleEntity> {
  constructor(
    @InjectModel(RoleDocument.name)
    readonly roleModel: PaginateModel<RoleDocument>,
    @InjectModel(RolePermissionDocument.name)
    private readonly rolePermissionModel: PaginateModel<RolePermissionDocument>,
    @InjectModel(PermissionDocument.name)
    private readonly permissionModel: PaginateModel<PermissionDocument>,
  ) {
    super(roleModel, RoleEntity);
  }

  public async paginate(
    filter: Filter<Role>,
    options: any,
  ): Promise<Pagination<RoleEntity>> {
    const result = await super.paginate(filter, options);

    // Get all role UUIDs from the current page
    const roleUuids = result.items.map((role: any) => role.uuid);

    if (roleUuids.length === 0) {
      return result;
    }

    // Fetch all role-permissions for these roles
    const rolePermissions = await this.rolePermissionModel
      .find({
        roleId: {
          $in: roleUuids.map((uuid: string) =>
            Buffer.from(uuid.replace(/-/g, ''), 'hex'),
          ),
        },
      })
      .exec();

    // Get unique permission IDs
    const permissionIds = [
      ...new Set(
        rolePermissions.map((rp) =>
          toUuid(rp.permissionId as unknown as Buffer),
        ),
      ),
    ];

    if (permissionIds.length === 0) {
      return result;
    }

    // Fetch all permissions
    const permissions = await this.permissionModel
      .find({
        uuid: {
          $in: permissionIds.map((id: string) =>
            Buffer.from(id.replace(/-/g, ''), 'hex'),
          ),
        },
      })
      .exec();

    // Create a map of permissions by UUID
    const permissionsMap = new Map(
      permissions.map((p) => [
        toUuid(p.uuid as unknown as Buffer),
        {
          uuid: toUuid(p.uuid as unknown as Buffer),
          name: p.name,
          code: p.code,
        },
      ]),
    );

    // Create a map of role permissions grouped by roleId
    const rolePermissionsMap = new Map<string, any[]>();
    rolePermissions.forEach((rp) => {
      const roleId = toUuid(rp.roleId as unknown as Buffer);
      const permissionId = toUuid(rp.permissionId as unknown as Buffer);
      const permission = permissionsMap.get(permissionId);

      if (permission) {
        if (!rolePermissionsMap.has(roleId)) {
          rolePermissionsMap.set(roleId, []);
        }
        rolePermissionsMap.get(roleId).push(permission);
      }
    });

    // Add permissions to each role entity by recreating them with permissions
    result.items = result.items.map((role: any) => {
      const roleData = role.toJson ? role.toJson() : role;
      return RoleEntity.create({
        ...roleData,
        permissions: rolePermissionsMap.get(roleData.uuid) || [],
      });
    });

    return result;
  }
}
