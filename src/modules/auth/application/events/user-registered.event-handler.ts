import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';
import { UuidService } from 'nestjs-uuid';
import { InternalServerErrorException, Logger } from '@nestjs/common';

import { UserRegisteredEvent } from '@/modules/auth/domain/events/user-registered.event';
import { UsersService } from '@/modules/auth/infrastructure/services/users.service';
import { InjectService } from '@/core/application/inject-service.decorator';
import { Scopes } from '@/modules/auth/domain/enums/scopes.enum';
import { ProfilesService } from '@/modules/auth/infrastructure/services/profiles.service';
import type { RolesService } from '@/modules/auth/infrastructure/services/roles.service';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredEventHandler
  implements IEventHandler<UserRegisteredEvent>
{
  constructor(
    @InjectService('UsersService')
    private readonly usersService: UsersService,
    @InjectService('ProfilesService')
    private readonly profilesService: ProfilesService,
    private readonly uuidService: UuidService,
    @InjectService('RolesService')
    private readonly rolesService: RolesService,
  ) {}

  public async handle(event: UserRegisteredEvent): Promise<any> {
    Logger.log(
      `User with ${event.registration.email} registered`,
      'UserRegisteredEventHandler',
    );

    const userId = this.uuidService.generate();
    const payload = event.registration;

    const role = await this.rolesService.findOne({
      name: 'default',
    });

    if (!role) {
      throw new InternalServerErrorException(`No role found for this user`);
    }

    const user = await this.usersService.create({
      uuid: userId,
      identityId: event.identityId,
      email: payload.email,
      username: payload.username,
      roleId: role.getUuid(),
      scopes: [Scopes.Website],
      isEmailVerified: false,
      isPhoneVerified: false,
      isConfirmed: false,
      isActive: true,
      isVerified: false,
    });

    const profile = await this.profilesService.create({
      uuid: this.uuidService.generate(),
      userId: user.getUuid(),
      displayName: payload.displayName,
      isPublic: true,
    });

    Logger.log(
      `User with ${user.getEmail()} created`,
      'UserRegisteredEventHandler',
    );

    Logger.log(
      `Profile for ${profile.getUserId()} created`,
      'UserRegisteredEventHandler',
    );
  }
}
