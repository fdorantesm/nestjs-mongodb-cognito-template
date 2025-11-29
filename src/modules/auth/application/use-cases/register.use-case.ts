import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { ConflictException, Logger } from '@nestjs/common';

import type { Context } from '@/core/domain/interfaces/context.interface';
import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Registration } from '@/modules/auth/domain/interfaces/registration.interface';
import { RegisterIdentityUserCommand } from '@/modules/identity/domain/commands/register-identity-user.command';
import { GetUserCountByEmailQuery } from '@/modules/users/domain/queries/get-user-count-by-email.query';
import { UserRegisteredEvent } from '@/modules/auth/domain/events/user-registered.event';
import { UserAlreadyRegisteredException } from '@/modules/auth/domain/exceptions/user-already-registered.exception';

@UseCase()
export class RegisterUseCase implements Executable {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async execute(
    context: Context,
    registration: Registration,
  ): Promise<void> {
    Logger.log(
      `Registering user with email ${registration.email}`,
      context.requestId,
    );

    const userExists = await this.queryBus.execute<number>(
      new GetUserCountByEmailQuery(registration.email) as any,
    );

    if (userExists) {
      throw new UserAlreadyRegisteredException(
        `User with email ${registration.email} already exists`,
      );
    }

    try {
      const { UserSub } = await this.commandBus.execute(
        new RegisterIdentityUserCommand(
          registration.email,
          registration.password,
          registration.displayName,
          (registration as any).phone,
        ),
      );

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
