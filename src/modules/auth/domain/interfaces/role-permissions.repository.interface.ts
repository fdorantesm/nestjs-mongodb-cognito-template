import type { RolePermission } from '@/modules/auth/domain/interfaces/role-permission.interface';
import type { RolePermissionEntity } from '@/modules/auth/domain/entities/role-permission.entity';
import type { Crud } from '@/core/domain/crud.interface';

export const ROLE_PERMISSIONS_REPOSITORY_TOKEN = 'RolePermissionsRepository';

export interface RolePermissionsRepository
  extends Crud<RolePermission, RolePermissionEntity> {
  findByRoleId(roleId: string): Promise<RolePermissionEntity[]>;
  findByRoleIdAndPermissionId(
    roleId: string,
    permissionId: string,
  ): Promise<RolePermissionEntity | null>;
}
