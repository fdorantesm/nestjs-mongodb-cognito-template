import { Injectable } from '@nestjs/common';
import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { UuidService } from 'nestjs-uuid';

import { CreateUserCommand } from '@/modules/users/domain/commands/create-user.command';
import { InjectService } from '@/core/application/inject-service.decorator';
import type { UsersService } from '@/modules/users/domain/interfaces/users.service.interface';
import { USERS_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/users.service.interface';
import type { ProfilesService } from '@/modules/users/domain/interfaces/profiles.service.interface';
import { PROFILES_SERVICE_TOKEN } from '@/modules/users/domain/interfaces/profiles.service.interface';
import { Scopes } from '@/modules/auth/domain/enums/scopes.enum';
import { UserCreatedEvent } from '@/modules/users/domain/events/user-created.event';
import { CreateIdentityUserCommand } from '@/modules/identity/domain/commands/create-identity-user.command';
import type { IdentityUserAttributes } from '@/modules/identity/domain/types/identity-user-attributes.type';
import { BadRequestException } from '@/core/domain/exceptions';

@CommandHandler(CreateUserCommand)
@Injectable()
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectService(USERS_SERVICE_TOKEN)
    private readonly usersService: UsersService,
    @InjectService(PROFILES_SERVICE_TOKEN)
    private readonly profilesService: ProfilesService,
    private readonly uuidService: UuidService,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
  ) {}

  public async execute(command: CreateUserCommand) {
    const {
      uuid,
      identityId,
      email,
      username,
      password,
      roleId,
      scopes,
      profile,
      isActive = true,
      isConfirmed = false,
      isEmailVerified = false,
      isPhoneVerified = false,
      isVerified = false,
    } = command.payload;

    const resolvedScopes =
      scopes && scopes.length > 0 ? scopes : [Scopes.Website];

    const displayName = profile?.displayName ?? username ?? email;
    const phone = profile?.phone;

    let resolvedIdentityId = identityId;

    if (!resolvedIdentityId) {
      if (!password) {
        throw new BadRequestException(
          'password is required when identityId is not provided',
        );
      }

      const identityAttributes = this.buildIdentityAttributes({
        username,
        roleId,
        scopes: resolvedScopes,
        isActive,
        isEmailVerified,
      });

      const identityResult = await this.commandBus.execute(
        new CreateIdentityUserCommand(
          email,
          password,
          undefined,
          identityAttributes,
          true,
          isActive,
          displayName,
          phone,
        ),
      );

      resolvedIdentityId = identityResult.identityId;
    }

    const user = await this.usersService.create({
      uuid: uuid ?? this.uuidService.generate(),
      identityId: resolvedIdentityId,
      email,
      username,
      roleId,
      scopes: resolvedScopes,
      isActive,
      isConfirmed,
      isEmailVerified,
      isPhoneVerified,
      isVerified,
    });

    if (profile) {
      await this.profilesService.create({
        uuid: this.uuidService.generate(),
        userId: user.getUuid(),
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        socialLinks: profile.socialLinks,
        birthday: profile.birthday,
        phone: profile.phone,
        gender: profile.gender,
        pronouns: profile.pronouns,
        isPublic: profile.isPublic ?? true,
      });
    }

    this.eventBus.publish(
      new UserCreatedEvent(user.getUuid(), resolvedIdentityId, user.getEmail()),
    );

    return user;
  }

  private buildIdentityAttributes(params: {
    username?: string;
    roleId: string;
    scopes: string[];
    isActive: boolean;
    isEmailVerified: boolean;
  }): IdentityUserAttributes {
    return {
      preferred_username: params.username,
      email_verified: params.isEmailVerified,
    };
  }
}
