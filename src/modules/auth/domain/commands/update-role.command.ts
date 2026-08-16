export type UpdateRolePayload = {
  name?: string;
  code?: string;
  permissions?: string[];
};

export class UpdateRoleCommand {
  constructor(
    public readonly roleId: string,
    public readonly payload: UpdateRolePayload,
  ) {}
}
