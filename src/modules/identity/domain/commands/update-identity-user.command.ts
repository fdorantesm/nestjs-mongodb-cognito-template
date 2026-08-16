import type { IdentityUserAttributes } from '@/modules/identity/domain/types/identity-user-attributes.type';

export class UpdateIdentityUserCommand {
  constructor(
    public readonly username: string,
    public readonly attributes?: IdentityUserAttributes,
    public readonly password?: string,
    public readonly enabled?: boolean,
  ) {}
}
