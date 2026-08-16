export type CreatePermissionPayload = {
  uuid?: string;
  name: string;
  code: string;
};

export class CreatePermissionCommand {
  constructor(public readonly payload: CreatePermissionPayload) {}
}
