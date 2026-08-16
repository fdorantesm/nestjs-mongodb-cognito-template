import { BaseEntity } from '@/core/domain/base-entity';
import type { Permission } from '@/modules/auth/domain/interfaces/permission.interface';

export class PermissionEntity extends BaseEntity<Permission> {
  constructor(permission: Permission) {
    super(permission);
  }

  public static create(permission: Permission): PermissionEntity {
    return new PermissionEntity(permission);
  }

  public toObject(): Permission {
    return {
      ...this._data,
    };
  }

  public toJson(): Permission {
    return {
      ...this._data,
    };
  }
}
