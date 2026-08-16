import { createScriptAppContext } from '$/bootstrap';
import { defaultUserSeeds } from '$/utils/users.map';
import { waitForHandlers } from '$/utils/wait-for-handlers';

import type { UsersService } from '@/modules/users/infrastructure/services/users.service';
import type { RolesService } from '@/modules/auth/infrastructure/services/roles.service';
import { Scopes } from '@/modules/auth/domain/enums/scopes.enum';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '@/modules/users/domain/commands/create-user.command';

async function resolveRoleUuid(
  rolesService: RolesService,
  roleName: string,
): Promise<string> {
  const roleEntity = await rolesService.findOne({ code: roleName });

  if (!roleEntity) {
    throw new Error(
      `Cannot seed user because role "${roleName}" does not exist. Run the role seed first.`,
    );
  }

  return roleEntity.getUuid();
}

async function seedUsers(): Promise<void> {
  const appContext = await createScriptAppContext();
  const usersService = appContext.get<UsersService>('UsersService');
  const rolesService = appContext.get<RolesService>('RolesService');
  const commandBus = appContext.get<CommandBus>(CommandBus);

  try {
    for (const seed of defaultUserSeeds) {
      const existingUser = await usersService.findOne({ email: seed.email });
      if (existingUser) {
        console.log(`User already exists for email ${seed.email}. Skipping.`);
        continue;
      }

      const roleId = await resolveRoleUuid(rolesService, seed.roleName);
      await commandBus.execute(
        new CreateUserCommand({
          email: seed.email,
          password: seed.password,
          username: seed.username,
          roleId,
          scopes: seed.scopes ?? [Scopes.Website],
          profile: seed.profile,
          isConfirmed: true,
          isEmailVerified: true,
          isPhoneVerified: true,
          isVerified: true,
          isActive: true,
        }),
      );

      console.log(
        `Seeded user ${seed.email} with role ${seed.roleName} via CQRS (profile visibility: ${seed.profile.isPublic}).`,
      );

      // Wait for async event handlers (wallet, stripe) to complete
      await waitForHandlers();
    }
  } finally {
    await appContext.close();
  }
}

seedUsers().catch((error) => {
  console.error('User seed failed:', error);
  process.exit(1);
});
