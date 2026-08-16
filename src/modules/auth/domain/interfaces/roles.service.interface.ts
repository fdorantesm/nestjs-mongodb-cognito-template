import type { Crud } from '@/core/domain/crud.interface';
import type { Role } from '@/modules/auth/domain/interfaces/role.interface';
import type { RoleEntity } from '@/modules/auth/domain/entities/role.entity';

export const ROLES_SERVICE_TOKEN = 'RolesService';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RolesService extends Crud<Role, RoleEntity> {}
