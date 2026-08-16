import type { Json } from '@/core/domain/json';

export type CreateUserProfilePayload = {
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
  isPublic?: boolean;
};

export type CreateUserPayload = {
  uuid?: string;
  identityId?: string;
  email: string;
  password?: string;
  username?: string;
  roleId: string;
  scopes?: string[];
  isConfirmed?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  profile?: CreateUserProfilePayload;
};

export class CreateUserCommand {
  constructor(public readonly payload: CreateUserPayload) {}
}
