import type { Crud } from '@/core/domain/crud.interface';
import type { RolePermission } from '@/modules/auth/domain/interfaces/role-permission.interface';
import type { RolePermissionEntity } from '@/modules/auth/domain/entities/role-permission.entity';

export const ROLE_PERMISSIONS_SERVICE_TOKEN = 'RolePermissionsService';

export interface RolePermissionsService
  extends Crud<RolePermission, RolePermissionEntity> {
  findByRoleId(roleId: string): Promise<RolePermissionEntity[]>;
  deleteByRoleId(roleId: string): Promise<void>;
}
