import { createScriptAppContext } from '$/bootstrap';
import { defaultUserSeeds } from '$/utils/users.map';
import { UuidService } from 'nestjs-uuid';

import type { UsersService } from '@/modules/users/infrastructure/services/users.service';
import type { ProfilesService } from '@/modules/users/infrastructure/services/profiles.service';
import type { RolesService } from '@/modules/auth/infrastructure/services/roles.service';
import { Scopes } from '@/modules/auth/domain/enums/scopes.enum';

async function resolveRoleUuid(
  rolesService: RolesService,
  roleName: string,
): Promise<string> {
  const roleEntity = await rolesService.findOne({ name: roleName });

  if (!roleEntity) {
    throw new Error(
      `Cannot seed user because role "${roleName}" does not exist. Run the role seed first.`,
    );
  }

  return roleEntity.getUuid();
}

async function seedUsersLocal(): Promise<void> {
  const appContext = await createScriptAppContext();
  const usersService = appContext.get<UsersService>('UsersService');
  const profilesService = appContext.get<ProfilesService>('ProfilesService');
  const rolesService = appContext.get<RolesService>('RolesService');
  const uuidService = appContext.get<UuidService>(UuidService);

  try {
    for (const seed of defaultUserSeeds) {
      const existingUser = await usersService.findOne({ email: seed.email });
      if (existingUser) {
        console.log(`User already exists for email ${seed.email}. Skipping.`);
        continue;
      }

      const roleId = await resolveRoleUuid(rolesService, seed.roleName);
      const userUuid = uuidService.generate();

      // Create user directly in MongoDB without Cognito
      const user = await usersService.create({
        uuid: userUuid,
        identityId: `local-${userUuid}`, // Mock identity ID for local development
        email: seed.email,
        roleId,
        scopes: seed.scopes ?? [Scopes.Website],
        isActive: true,
        isConfirmed: true,
        isEmailVerified: true,
        isPhoneVerified: false,
        isVerified: true,
      });

      // Create profile
      const displayName = seed.profile.displayName || seed.username;
      await profilesService.create({
        uuid: uuidService.generate(),
        userId: user.getUuid(),
        displayName,
        avatarUrl: seed.profile.avatarUrl,
        bio: seed.profile.bio,
        location: seed.profile.location,
        website: seed.profile.website,
        socialLinks: seed.profile.socialLinks,
        birthday: seed.profile.birthday,
        phone: seed.profile.phone,
        gender: seed.profile.gender,
        pronouns: seed.profile.pronouns,
        isPublic: seed.profile.isPublic,
      });

      console.log(
        `✓ Created user ${seed.email} with role ${seed.roleName} (local mode - no Cognito)`,
      );
    }

    console.log(
      '\nNote: These users are created WITHOUT Cognito authentication.',
    );
    console.log('They exist only in MongoDB for development/testing purposes.');
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  } finally {
    await appContext.close();
  }
}

seedUsersLocal().catch((error) => {
  console.error('Local user seed failed:', error);
  process.exit(1);
});
