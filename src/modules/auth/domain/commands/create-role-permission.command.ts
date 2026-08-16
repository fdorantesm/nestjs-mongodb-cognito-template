export type CreateRolePermissionPayload = {
  uuid?: string;
  roleId: string;
  permissionId: string;
};

export class CreateRolePermissionCommand {
  constructor(public readonly payload: CreateRolePermissionPayload) {}
}
