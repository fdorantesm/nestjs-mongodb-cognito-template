import type { Crud } from '@/core/domain/crud.interface';
import type { Permission } from '@/modules/auth/domain/interfaces/permission.interface';
import type { PermissionEntity } from '@/modules/auth/domain/entities/permission.entity';

export const PERMISSIONS_SERVICE_TOKEN = 'PermissionsService';

export interface PermissionsService extends Crud<Permission, PermissionEntity> {
  findByCode(code: string): Promise<PermissionEntity | null>;
  findByCodes(codes: string[]): Promise<PermissionEntity[]>;
}
