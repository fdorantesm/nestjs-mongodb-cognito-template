import type { BaseProps } from '@/core/domain/interfaces/base-props.interface';

export interface RolePermission extends BaseProps {
  roleId: string;
  permissionId: string;
}
