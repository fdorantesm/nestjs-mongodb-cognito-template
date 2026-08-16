import type { IdentityUserAttributes } from '@/modules/identity/domain/types/identity-user-attributes.type';

export type CreateIdentityUserInput = {
  email: string;
  password?: string;
  temporaryPassword?: string;
  name?: string;
  phone?: string;
  attributes?: IdentityUserAttributes;
  suppressInvitation?: boolean;
  enabled?: boolean;
};

export type CreateIdentityUserResult = {
  identityId: string;
  username: string;
  temporaryPassword?: string;
};

export type UpdateIdentityUserInput = {
  username: string;
  attributes?: IdentityUserAttributes;
  password?: string;
  enabled?: boolean;
};

export type DeleteIdentityUserInput = {
  username: string;
};

export type IdentityUser = {
  username: string;
  identityId?: string;
  enabled: boolean;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  attributes: Record<string, string>;
};
