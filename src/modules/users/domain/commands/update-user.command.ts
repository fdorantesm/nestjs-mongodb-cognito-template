import type { Json } from '@/core/domain/json';

export type UpdateUserPayload = {
  email?: string;
  username?: string;
  roleId?: string;
  scopes?: string[];
  isConfirmed?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  password?: string;
  profile?: {
    displayName?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    website?: string;
    socialLinks?: Json;
    birthday?: Date;
    phone?: string;
    gender?: string;
    pronouns?: string;
    isPublic?: boolean;
  };
};

export class UpdateUserCommand {
  constructor(
    public readonly userId: string,
    public readonly payload: UpdateUserPayload,
  ) {}
}
