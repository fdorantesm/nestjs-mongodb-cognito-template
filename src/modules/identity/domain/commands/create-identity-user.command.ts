import type { IdentityUserAttributes } from '@/modules/identity/domain/types/identity-user-attributes.type';

export class CreateIdentityUserCommand {
  constructor(
    public readonly email: string,
    public readonly password?: string,
    public readonly temporaryPassword?: string,
    public readonly attributes?: IdentityUserAttributes,
    public readonly suppressInvitation?: boolean,
    public readonly enabled?: boolean,
    public readonly name?: string,
    public readonly phone?: string,
  ) {}
}
