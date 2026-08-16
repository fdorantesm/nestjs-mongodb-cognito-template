import { BaseEntity } from '@/core/domain/base-entity';
import type { Role } from '@/modules/auth/domain/interfaces/role.interface';

export class RoleEntity extends BaseEntity<Role> {
  constructor(role: Role) {
    super(role);
  }

  public static create(role: Role): RoleEntity {
    return new RoleEntity(role);
  }

  public toObject(): Role {
    return {
      ...this._data,
    };
  }

  public toJson(): Role {
    return {
      ...this._data,
    };
  }
}
