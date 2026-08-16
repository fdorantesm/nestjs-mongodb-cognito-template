import type { Role } from '@/modules/auth/domain/interfaces/role.interface';
import type { RoleEntity } from '@/modules/auth/domain/entities/role.entity';
import type { Crud } from '@/core/domain/crud.interface';

export const ROLES_REPOSITORY_TOKEN = 'RolesRepository';

export interface RolesRepository extends Crud<Role, RoleEntity> {
  findByCode(code: string): Promise<RoleEntity | null>;
}
