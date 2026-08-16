import type { Permission } from '@/modules/auth/domain/interfaces/permission.interface';
import type { PermissionEntity } from '@/modules/auth/domain/entities/permission.entity';
import type { Crud } from '@/core/domain/crud.interface';

export const PERMISSIONS_REPOSITORY_TOKEN = 'PermissionsRepository';

export interface PermissionsRepository
  extends Crud<Permission, PermissionEntity> {
  findByCode(code: string): Promise<PermissionEntity | null>;
}
