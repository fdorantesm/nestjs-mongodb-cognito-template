import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';
import { UuidService } from 'nestjs-uuid';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { ROLES_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/roles.service.interface';
import { UserRegisteredEvent } from '@/modules/auth/domain/events/user-registered.event';
import { InjectService } from '@/core/application/inject-service.decorator';
import { Scopes } from '@/modules/auth/domain/enums/scopes.enum';
import type { RolesService } from '@/modules/auth/domain/interfaces/roles.service.interface';
import { CreateUserCommand } from '@/modules/users/domain/commands/create-user.command';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredEventHandler
  implements IEventHandler<UserRegisteredEvent>
{
  constructor(
    private readonly uuidService: UuidService,
    @InjectService(ROLES_SERVICE_TOKEN)
    private readonly rolesService: RolesService,
    private readonly commandBus: CommandBus,
  ) {}

  public async handle(event: UserRegisteredEvent): Promise<any> {
    Logger.log(
      `User with ${event.registration.email} registered`,
      'UserRegisteredEventHandler',
    );

    const userId = this.uuidService.generate();
    const payload = event.registration;

    const role = await this.rolesService.findOne({
      name: 'user',
    });

    if (!role) {
      throw new InternalServerErrorException(`No role found for this user`);
    }

    // Use CreateUserCommand so UsersModule handles persistence and profile creation
    const user = await this.commandBus.execute(
      new CreateUserCommand({
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
        profile: {
          displayName: payload.displayName,
          isPublic: true,
        },
      }),
    );

    Logger.log(
      `User with ${user.getEmail()} created`,
      'UserRegisteredEventHandler',
    );
  }
}
