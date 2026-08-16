import { BaseEntity } from '@/core/domain/base-entity';
import type { RolePermission } from '@/modules/auth/domain/interfaces/role-permission.interface';

export class RolePermissionEntity extends BaseEntity<RolePermission> {
  constructor(rolePermission: RolePermission) {
    super(rolePermission);
  }

  public static create(rolePermission: RolePermission): RolePermissionEntity {
    return new RolePermissionEntity(rolePermission);
  }

  public getRoleId(): string {
    return this._data.roleId;
  }

  public getPermissionId(): string {
    return this._data.permissionId;
  }

  public toObject(): RolePermission {
    return {
      ...this._data,
    };
  }

  public toJson(): RolePermission {
    return {
      ...this._data,
    };
  }
}
