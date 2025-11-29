import type { BaseProps } from '@/core/domain/interfaces/base-props.interface';
import type { RolePermissionsAggregate } from '@/modules/auth/domain/aggregates/roles-permissions.aggregate';

export interface Role extends BaseProps, Partial<RolePermissionsAggregate> {
  name: string;
  code: string;
}
