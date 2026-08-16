import type { BaseProps } from '@/core/domain/interfaces/base-props.interface';
import type { Json } from '@/core/domain/json';

export interface Profile extends BaseProps {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: Json;
  birthday?: Date;
  phone?: string;
  gender?: string;
  pronouns?: string;
  isPublic: boolean;
}
