import type { BaseProps } from '@/core/domain/interfaces/base-props.interface';

export interface Permission extends BaseProps {
  name: string;
  code: string;
}
