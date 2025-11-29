import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { Repository } from '@/core/application/repository.decorator';
import { BaseRepository } from '@/core/infrastructure/repositories/base.repository';
import type { Filter } from '@/core/domain/interfaces/filter.interface';
import type { Pagination } from '@/core/domain/pagination';
import { RolePermissionEntity } from '@/modules/auth/domain/entities/role-permission.entity';
import type { RolePermission } from '@/modules/auth/domain/interfaces/role-permission.interface';
import { RolePermissionDocument } from '@/modules/auth/infrastructure/database/models/role-permission.model';
import { RoleDocument } from '@/modules/auth/infrastructure/database/models/roles.model';
import { PermissionDocument } from '@/modules/auth/infrastructure/database/models/permission.model';
import { toUuid } from '@/utils/mongo-uuid';

@Repository()
export class RolePermissionsRepository extends BaseRepository<
  RolePermission,
  RolePermissionEntity
> {
  constructor(
    @InjectModel(RolePermissionDocument.name)
    readonly rolePermissionModel: PaginateModel<RolePermissionDocument>,
    @InjectModel(RoleDocument.name)
    private readonly roleModel: PaginateModel<RoleDocument>,
    @InjectModel(PermissionDocument.name)
    private readonly permissionModel: PaginateModel<PermissionDocument>,
  ) {
    super(rolePermissionModel, RolePermissionEntity);
  }

  public async paginate(
    filter: Filter<RolePermission>,
    options: any,
  ): Promise<Pagination<RolePermissionEntity>> {
    options.page = options.page ?? 1;
    options.limit = options.limit ?? 10;

    const result = await this.rolePermissionModel.paginate(
      filter as RolePermission,
      options,
    );

    // Get all unique role and permission UUIDs
    const roleUuids = new Set<string>();
    const permissionUuids = new Set<string>();

    result.docs.forEach((doc) => {
      const obj = doc.toObject({ getters: true, virtuals: false });
      if (obj.roleId) {
        const roleId = Buffer.isBuffer(obj.roleId)
          ? toUuid(obj.roleId)
          : obj.roleId;
        roleUuids.add(roleId);
      }
      if (obj.permissionId) {
        const permissionId = Buffer.isBuffer(obj.permissionId)
          ? toUuid(obj.permissionId)
          : obj.permissionId;
        permissionUuids.add(permissionId);
      }
    });

    // Fetch all roles and permissions at once
    const [roles, permissions] = await Promise.all([
      this.roleModel.find({ uuid: { $in: Array.from(roleUuids) } }).exec(),
      this.permissionModel
        .find({ uuid: { $in: Array.from(permissionUuids) } })
        .exec(),
    ]);

    // Create maps
    const rolesMap = new Map(
      roles.map((r: any) => [
        toUuid(r.uuid),
        r.toObject({ getters: true, virtuals: true }),
      ]),
    );
    const permissionsMap = new Map(
      permissions.map((p: any) => [
        toUuid(p.uuid),
        p.toObject({ getters: true, virtuals: true }),
      ]),
    );

    // Map documents with populated role and permission
    const mappedItems = result.docs.map((doc) => {
      const obj = doc.toObject({ getters: true, virtuals: true });

      const roleId = Buffer.isBuffer(obj.roleId)
        ? toUuid(obj.roleId)
        : obj.roleId;
      const permissionId = Buffer.isBuffer(obj.permissionId)
        ? toUuid(obj.permissionId)
        : obj.permissionId;

      const role = rolesMap.get(roleId);
      const permission = permissionsMap.get(permissionId);

      if (role) {
        obj.role = {
          uuid: toUuid(role.uuid),
          name: role.name,
          code: role.code,
        };
        delete obj.roleId;
      }

      if (permission) {
        obj.permission = {
          uuid: toUuid(permission.uuid),
          name: permission.name,
          code: permission.code,
        };
        delete obj.permissionId;
      }

      return new RolePermissionEntity(obj);
    });

    return {
      items: mappedItems,
      total: result.totalDocs,
      limit: result.limit,
      page: result.page,
      pages: result.totalPages,
      offset: (result.page - 1) * result.limit,
      prevPage: result.prevPage || undefined,
      nextPage: result.nextPage || undefined,
      hasMore: result.hasNextPage,
    };
  }

  public async findByRoleId(roleId: string): Promise<RolePermissionEntity[]> {
    const rolePermissions = await this.rolePermissionModel
      .find({ roleId })
      .exec();

    return rolePermissions.map(
      (rp) =>
        new RolePermissionEntity(
          rp.toObject({ getters: true, virtuals: true }) as RolePermission,
        ),
    );
  }
}
