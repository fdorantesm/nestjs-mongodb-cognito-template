import type { Profile } from '@/modules/auth/domain/interfaces/profile.interface';
import type { ResourceProps } from '@/core/domain/interfaces/resource-props.interface';

export interface User extends ResourceProps {
  identityId: string;
  username?: string;
  email: string;
  roleId: string;
  scopes: string[];
  isConfirmed: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isVerified: boolean;
}

export interface UserProfileAggregate extends User {
  profile: Profile;
}
