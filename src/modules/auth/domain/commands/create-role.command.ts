export type CreateRolePayload = {
  uuid?: string;
  name: string;
  code: string;
  permissions?: string[];
};

export class CreateRoleCommand {
  constructor(public readonly payload: CreateRolePayload) {}
}
