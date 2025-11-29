export type UpdatePermissionPayload = {
  name?: string;
  code?: string;
};

export class UpdatePermissionCommand {
  constructor(
    public readonly permissionId: string,
    public readonly payload: UpdatePermissionPayload,
  ) {}
}
