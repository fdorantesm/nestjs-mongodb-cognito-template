import { createScriptAppContext } from '$/bootstrap';
import { defaultPermissions, defaultRoles } from '$/utils/roles.map';

import type { PermissionsService } from '@/modules/auth/infrastructure/services/permissions.service';
import type { RolesService } from '@/modules/auth/infrastructure/services/roles.service';
import type { RolePermissionsService } from '@/modules/auth/infrastructure/services/role-permissions.service';

async function cleanRolePermissions(
  rolePermissionsService: RolePermissionsService,
  rolesService: RolesService,
): Promise<void> {
  const roleNames = defaultRoles.map((role) => role.name);
  const roleUuids = new Map<string, string>();

  for (const roleName of roleNames) {
    const roleEntity = await rolesService.findOne({ name: roleName });
    if (!roleEntity) {
      continue;
    }

    roleUuids.set(roleName, roleEntity.getUuid());
    await rolePermissionsService.deleteMany({ roleId: roleEntity.getUuid() });
  }

  if (roleUuids.size === 0) {
    return;
  }
}

async function cleanRoles(rolesService: RolesService): Promise<void> {
  const roleNames = defaultRoles.map((role) => role.name);
  for (const roleName of roleNames) {
    await rolesService.deleteMany({ name: roleName });
  }
}

async function cleanPermissions(
  permissionsService: PermissionsService,
): Promise<void> {
  const permissionCodes = defaultPermissions.map(
    (permission) => permission.code,
  );
  for (const code of permissionCodes) {
    await permissionsService.deleteMany({ code });
  }
}

async function runUnseed(): Promise<void> {
  const appContext = await createScriptAppContext();
  const permissionsService =
    appContext.get<PermissionsService>('PermissionsService');
  const rolesService = appContext.get<RolesService>('RolesService');
  const rolePermissionsService = appContext.get<RolePermissionsService>(
    'RolePermissionsService',
  );

  try {
    await cleanRolePermissions(rolePermissionsService, rolesService);
    await cleanRoles(rolesService);
    await cleanPermissions(permissionsService);
  } finally {
    await appContext.close();
  }
}

runUnseed().catch((error) => {
  console.error('Role unseed failed:', error);
  process.exit(1);
});
