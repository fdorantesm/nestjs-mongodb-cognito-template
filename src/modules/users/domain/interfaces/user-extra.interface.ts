import type { BaseProps } from '@/core/domain/interfaces/base-props.interface';
import type { Json } from '@/core/domain/json';

export interface UserExtra extends BaseProps {
  userId: string;
  provider: string;
  externalId: string;
  externalData?: Json;
}
