import { EventBus } from '@nestjs/cqrs';
import { ConflictException, Logger } from '@nestjs/common';

import type { Context } from '@/core/domain/interfaces/context.interface';
import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Registration } from '@/modules/auth/domain/interfaces/registration.interface';
import { IdentityService } from '@/modules/auth/infrastructure/services/identity.service';
import { InjectService } from '@/core/application/inject-service.decorator';
import { UserRegisteredEvent } from '@/modules/auth/domain/events/user-registered.event';
import type { UsersService } from '@/modules/auth/infrastructure/services/users.service';
import { UserAlreadyRegisteredException } from '@/modules/auth/domain/exceptions/user-already-registered.exception';

@UseCase()
export class RegisterUseCase implements Executable {
  constructor(
    @InjectService('IdentityService')
    private readonly identitiyService: IdentityService,
    private readonly eventBus: EventBus,
    @InjectService('UsersService')
    private readonly usersService: UsersService,
  ) {}

  public async execute(
    context: Context,
    registration: Registration,
  ): Promise<void> {
    Logger.log(
      `Registering user with email ${registration.email}`,
      context.requestId,
    );

    const userExists = await this.usersService.count({
      email: registration.email,
    });

    if (userExists) {
      throw new UserAlreadyRegisteredException(
        `User with email ${registration.email} already exists`,
      );
    }

    try {
      const { UserSub } = await this.identitiyService.register({
        email: registration.email,
        password: registration.password,
      });

      this.eventBus.publish(
        new UserRegisteredEvent(UserSub, {
          displayName: registration.displayName,
          email: registration.email,
          username: registration.username,
        }),
      );
    } catch (error) {
      Logger.error(
        `Error registering user with email ${registration.email}: ${error.message}`,
        context.requestId,
      );

      throw new ConflictException(
        `Error registering user with email ${registration.email}: ${error.message}`,
      );
    }
  }
}
