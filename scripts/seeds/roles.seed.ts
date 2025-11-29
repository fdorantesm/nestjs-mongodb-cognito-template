import { UuidService } from 'nestjs-uuid';

import { createScriptAppContext } from '$/bootstrap';
import { defaultPermissions, defaultRoles } from '$/utils/roles.map';

import type { Permission } from '@/modules/auth/domain/interfaces/permission.interface';
import type { Role } from '@/modules/auth/domain/interfaces/role.interface';
import type { RolePermission } from '@/modules/auth/domain/interfaces/role-permission.interface';
import type { PermissionsService } from '@/modules/auth/infrastructure/services/permissions.service';
import type { RolesService } from '@/modules/auth/infrastructure/services/roles.service';
import type { RolePermissionsService } from '@/modules/auth/infrastructure/services/role-permissions.service';

async function ensurePermissions(
  permissionsService: PermissionsService,
  uuidService: UuidService,
): Promise<Map<string, string>> {
  const codeToUuid = new Map<string, string>();

  for (const permission of defaultPermissions) {
    let permissionEntity = await permissionsService.findOne({
      code: permission.code,
    });

    if (!permissionEntity) {
      const permissionPayload: Permission = {
        ...permission,
        uuid: uuidService.generate(),
      };

      permissionEntity = await permissionsService.create(permissionPayload);
      console.log(`Permission created: ${permission.code}`);
    }

    const permissionUuid = permissionEntity.getUuid();
    if (!permissionUuid) {
      throw new Error(`Permission ${permission.code} missing uuid`);
    }

    codeToUuid.set(permission.code, permissionUuid);
  }

  return codeToUuid;
}

async function ensureRoles(
  rolesService: RolesService,
  permissionUuidByCode: Map<string, string>,
  uuidService: UuidService,
): Promise<Map<string, string>> {
  const roleUuidByName = new Map<string, string>();

  for (const roleDefinition of defaultRoles) {
    const existing = await rolesService.findOne({
      name: roleDefinition.name,
    });

    if (existing) {
      console.log(`Role found: ${roleDefinition.name}`);
      roleUuidByName.set(roleDefinition.name, existing.getUuid());
      continue;
    }

    const rolePayload: Role = {
      uuid: uuidService.generate(),
      name: roleDefinition.name,
      code: roleDefinition.code,
    };

    const created = await rolesService.create(rolePayload);
    console.log(`Role created: ${roleDefinition.name}`);
    roleUuidByName.set(roleDefinition.name, created.getUuid());
  }

  return roleUuidByName;
}

async function ensureRolePermissions(
  rolePermissionsService: RolePermissionsService,
  roleUuidByName: Map<string, string>,
  permissionUuidByCode: Map<string, string>,
  uuidService: UuidService,
): Promise<void> {
  for (const roleDefinition of defaultRoles) {
    const roleUuid = roleUuidByName.get(roleDefinition.name);
    if (!roleUuid) {
      throw new Error(`Missing role uuid for ${roleDefinition.name}`);
    }

    for (const permissionCode of roleDefinition.permissionCodes) {
      const permissionUuid = permissionUuidByCode.get(permissionCode);
      if (!permissionUuid) {
        throw new Error(`Missing permission uuid for code ${permissionCode}`);
      }

      const exists = await rolePermissionsService.exists({
        roleId: roleUuid,
        permissionId: permissionUuid,
      });

      if (exists) {
        continue;
      }

      const rolePermission: RolePermission = {
        uuid: uuidService.generate(),
        roleId: roleUuid,
        permissionId: permissionUuid,
      };

      await rolePermissionsService.create(rolePermission);
      console.log(`Linked ${roleDefinition.name} to ${permissionCode}`);
    }
  }
}

async function runRoleSeed(): Promise<void> {
  const appContext = await createScriptAppContext();
  const permissionsService =
    appContext.get<PermissionsService>('PermissionsService');

  const rolesService = appContext.get<RolesService>('RolesService');
  const uuidService = appContext.get<UuidService>(UuidService);
  const rolePermissionsService = appContext.get<RolePermissionsService>(
    'RolePermissionsService',
  );

  try {
    const permissionUuidByCode = await ensurePermissions(
      permissionsService,
      uuidService,
    );
    const roleUuidByName = await ensureRoles(
      rolesService,
      permissionUuidByCode,
      uuidService,
    );
    await ensureRolePermissions(
      rolePermissionsService,
      roleUuidByName,
      permissionUuidByCode,
      uuidService,
    );
  } finally {
    await appContext.close();
  }
}

runRoleSeed().catch((error) => {
  console.error('Role seed failed:', error);
  process.exit(1);
});
