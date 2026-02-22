import type { Permission } from '@/modules/auth/domain/interfaces/permission.interface';

type PermissionSeed = Omit<Permission, 'uuid'>;

export type RoleDefinition = {
  name: string;
  code: string;
  permissionCodes: string[];
};

export const defaultPermissions: PermissionSeed[] = [
  // Auth permissions
  {
    name: 'Login',
    code: 'Auth:Login',
    description: 'Authenticate user and obtain access token',
  },
  {
    name: 'Recover Password',
    code: 'Auth:RecoverPassword',
    description: 'Request password recovery email',
  },
  {
    name: 'Reset Password',
    code: 'Auth:ResetPassword',
    description: 'Reset password with recovery token',
  },
  {
    name: 'Get Me',
    code: 'Auth:GetMe',
    description: 'Get own user profile information',
  },

  // User permissions - Self
  {
    name: 'Get Own Profile',
    code: 'Users:Get:Self',
    description: 'Read own user profile',
  },
  {
    name: 'Update Own Profile',
    code: 'Users:Update:Self',
    description: 'Update own user profile',
  },
  {
    name: 'Update Own Profile Extended',
    code: 'Profile:Update:Self',
    description: 'Update own extended profile information',
  },

  // User permissions - Admin level
  {
    name: 'List Users',
    code: 'Users:List',
    description: 'List all users with pagination',
  },
  {
    name: 'Get Any User',
    code: 'Users:Get:*',
    description: 'Read any user profile by UUID',
  },
  {
    name: 'Create User',
    code: 'Users:Create',
    description: 'Create new user account',
  },
  {
    name: 'Update Any User',
    code: 'Users:Update:*',
    description: 'Update any user profile',
  },
  {
    name: 'Delete Any User',
    code: 'Users:Delete:*',
    description: 'Delete any user account',
  },

  // Role permissions
  {
    name: 'List Roles',
    code: 'Roles:List',
    description: 'List all roles with pagination',
  },
  {
    name: 'Get Role',
    code: 'Roles:Get:*',
    description: 'Read role details by UUID',
  },
  {
    name: 'Create Role',
    code: 'Roles:Create',
    description: 'Create new role',
  },
  {
    name: 'Update Role',
    code: 'Roles:Update:*',
    description: 'Update role details',
  },
  {
    name: 'Delete Role',
    code: 'Roles:Delete:*',
    description: 'Delete role',
  },

  // Permission permissions
  {
    name: 'List Permissions',
    code: 'Permissions:List',
    description: 'List all permissions with pagination',
  },
  {
    name: 'Get Permission',
    code: 'Permissions:Get:*',
    description: 'Read permission details by UUID',
  },
  {
    name: 'Create Permission',
    code: 'Permissions:Create',
    description: 'Create new permission',
  },
  {
    name: 'Update Permission',
    code: 'Permissions:Update:*',
    description: 'Update permission details',
  },
  {
    name: 'Delete Permission',
    code: 'Permissions:Delete:*',
    description: 'Delete permission',
  },

  // Role-Permission associations
  {
    name: 'Associate Permission to Role',
    code: 'RolePermissions:Associate:*',
    description: 'Associate permission to any role',
  },
  {
    name: 'Dissociate Permission from Role',
    code: 'RolePermissions:Dissociate:*',
    description: 'Remove permission from any role',
  },
  {
    name: 'List Role Permissions',
    code: 'RolePermissions:List',
    description: 'List all role-permission associations',
  },

  // Configuration permissions
  {
    name: 'Read Settings',
    code: 'Settings:Read',
    description: 'Read application settings',
  },
  {
    name: 'Update Settings',
    code: 'Settings:Update',
    description: 'Update application settings',
  },
  {
    name: 'Delete Settings',
    code: 'Settings:Delete',
    description: 'Delete application settings',
  },
];

const basicUserPermissions = [
  'Auth:Login',
  'Auth:RecoverPassword',
  'Auth:ResetPassword',
  'Auth:GetMe',
  'Users:Get:Self',
  'Users:Update:Self',
  'Profile:Update:Self',
];

const adminUserPermissions = [
  'Users:List',
  'Users:Get:*',
  'Users:Create',
  'Users:Update:*',
  'Users:Delete:*',
];

const roleManagementPermissions = [
  'Roles:List',
  'Roles:Get:*',
  'Roles:Create',
  'Roles:Update:*',
  'Roles:Delete:*',
];

const permissionManagementPermissions = [
  'Permissions:List',
  'Permissions:Get:*',
  'Permissions:Create',
  'Permissions:Update:*',
  'Permissions:Delete:*',
  'RolePermissions:Associate:*',
  'RolePermissions:Dissociate:*',
  'RolePermissions:List',
];

const settingsPermissions = ['Settings:Read', 'Settings:Update', 'Settings:Delete'];

export const defaultRoles: RoleDefinition[] = [
  {
    name: 'Root',
    code: 'root',
    permissionCodes: [
      ...basicUserPermissions,
      ...adminUserPermissions,
      ...roleManagementPermissions,
      ...permissionManagementPermissions,
      ...settingsPermissions,
    ],
  },
  {
    name: 'Admin',
    code: 'admin',
    permissionCodes: [
      ...basicUserPermissions,
      ...adminUserPermissions,
      ...settingsPermissions,
    ],
  },
  {
    name: 'User',
    code: 'user',
    permissionCodes: basicUserPermissions,
  },
];
