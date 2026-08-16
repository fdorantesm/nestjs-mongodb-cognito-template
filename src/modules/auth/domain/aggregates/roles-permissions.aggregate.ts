export interface RolePermissionsAggregate {
  permissions:
    | string[]
    | Array<{
        uuid: string;
        name: string;
        code: string;
      }>;
}
