import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { InjectService } from '@/core/application/inject-service.decorator';
import type { UsersService } from '@/modules/users/domain/interfaces/users.service.interface';
import { USERS_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/users.service.interface';
import type { ProfilesService } from '@/modules/users/domain/interfaces/profiles.service.interface';
import { PROFILES_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/profiles.service.interface';
import { UpdateUserCommand } from '@/modules/users/domain/commands/update-user.command';
import { UpdateIdentityUserCommand } from '@/modules/identity/domain/commands/update-identity-user.command';
import type { IdentityUserAttributes } from '@/modules/identity/domain/types/identity-user-attributes.type';
import { UserNotFoundException } from '@/modules/users/domain/exceptions';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectService(USERS_SERVICE_TOKEN)
    private readonly usersService: UsersService,
    @InjectService(PROFILES_SERVICE_TOKEN)
    private readonly profilesService: ProfilesService,
    private readonly commandBus: CommandBus,
  ) {}

  public async execute(command: UpdateUserCommand) {
    const { userId, payload } = command;

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UserNotFoundException(userId);
    }

    if (payload.profile) {
      await this.profilesService.update(
        { userId },
        {
          ...payload.profile,
          isPublic:
            payload.profile.isPublic === undefined
              ? undefined
              : payload.profile.isPublic,
        },
      );
    }

    const userPayload = { ...payload } as Record<string, unknown>;
    delete userPayload.profile;
    delete userPayload.password;

    if (Object.keys(userPayload).length > 0) {
      await this.usersService.update({ uuid: userId }, userPayload as any);
    }

    await this.syncIdentity(user.getIdentityId(), payload);

    return this.usersService.findById(userId);
  }

  private async syncIdentity(
    identityId: string | undefined,
    payload: UpdateUserCommand['payload'],
  ): Promise<void> {
    if (!identityId) {
      return;
    }

    const attributes: IdentityUserAttributes = {};

    if (payload.email) {
      attributes.email = payload.email;
    }

    if (payload.username) {
      attributes.preferred_username = payload.username;
    }

    if (payload.profile?.displayName) {
      attributes.name = payload.profile.displayName;
    }

    if (payload.profile?.phone) {
      attributes.phone_number = payload.profile.phone;
    }

    if (payload.isEmailVerified !== undefined) {
      attributes.email_verified = payload.isEmailVerified;
    }

    const hasAttributeUpdates = Object.keys(attributes).length > 0;
    const hasPasswordUpdate = payload.password !== undefined;

    if (!hasAttributeUpdates && !hasPasswordUpdate) {
      return;
    }

    await this.commandBus.execute(
      new UpdateIdentityUserCommand(
        identityId,
        hasAttributeUpdates ? attributes : undefined,
        payload.password,
        payload.isActive,
      ),
    );
  }
}
