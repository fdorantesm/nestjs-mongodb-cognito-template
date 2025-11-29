import { createScriptAppContext } from '$/bootstrap';
import { defaultUserSeeds } from '$/utils/users.map';
import { CommandBus } from '@nestjs/cqrs';

import type { UsersService } from '@/modules/users/infrastructure/services/users.service';
import type { ProfilesService } from '@/modules/users/infrastructure/services/profiles.service';
import type { UserExtrasService } from '@/modules/users/infrastructure/services/users-extra.service';
import { DeleteIdentityUserCommand } from '@/modules/identity/domain/commands/delete-identity-user.command';
import { Logger } from '@nestjs/common';

async function removeSeedUser(
  usersService: UsersService,
  profilesService: ProfilesService,
  userExtrasService: UserExtrasService,
  commandBus: CommandBus,
  email: string,
): Promise<void> {
  const user = await usersService.findOne({ email });

  if (!user) {
    console.log(`No user found for email ${email}. Skipping.`);
    await deleteIdentityAccount(commandBus, email);
    return;
  }

  const userUuid = user.getUuid();
  await profilesService.deleteMany({ userId: userUuid });

  // Delete associated user extras
  const extras = await userExtrasService.findByUserId(userUuid);
  for (const extra of extras) {
    await userExtrasService.deleteByUserIdAndProvider(userUuid, extra.provider);
  }

  await usersService.delete({ uuid: userUuid });

  Logger.log(`Removed seeded user ${email} and linked profile.`);

  await deleteIdentityAccount(commandBus, user.getIdentityId() ?? email);
}

async function deleteIdentityAccount(
  commandBus: CommandBus,
  identityUsername?: string,
): Promise<void> {
  if (!identityUsername) {
    Logger.log('Seeded user had no identityId. Skipping Cognito cleanup.');
    return;
  }

  try {
    await commandBus.execute(new DeleteIdentityUserCommand(identityUsername));
    Logger.log(`Removed Cognito user ${identityUsername}.`);
  } catch (error: any) {
    if (error?.name === 'UserNotFoundException') {
      Logger.log(`No Cognito user found for ${identityUsername}. Skipping.`);
      return;
    }

    Logger.error(`Failed to remove Cognito user ${identityUsername}:`, error);
    throw error;
  }
}

async function runUserUnseed(): Promise<void> {
  const appContext = await createScriptAppContext();
  const usersService = appContext.get<UsersService>('UsersService');
  const profilesService = appContext.get<ProfilesService>('ProfilesService');
  const userExtrasService =
    appContext.get<UserExtrasService>('UserExtrasService');
  const commandBus = appContext.get<CommandBus>(CommandBus);

  try {
    for (const seed of defaultUserSeeds) {
      await removeSeedUser(
        usersService,
        profilesService,
        userExtrasService,
        commandBus,
        seed.email,
      );
    }
  } finally {
    await appContext.close();
  }
}

runUserUnseed().catch((error) => {
  console.error('User unseed failed:', error);
  process.exit(1);
});
