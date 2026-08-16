import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { UseCase } from '@/core/application/case.decorator';
import { InvalidCredentialsException } from '@/core/domain/exceptions/invalid-credentials';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { UserAlreadyConfirmedException } from '@/modules/auth/domain/exceptions/user-already-confirmed.exception';
import { ConfirmRegisterCommand } from '@/modules/identity/domain/commands/confirm-register.command';
import { GetUserByEmailQuery } from '@/modules/users/domain/queries/get-user-by-email.query';
import { UpdateUserCommand } from '@/modules/users/domain/commands/update-user.command';

@UseCase()
export class ConfirmRegisterUseCase implements Executable {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  public async execute(
    context: Context,
    email: string,
    confirmationCode: string,
  ): Promise<unknown> {
    Logger.log(`Confirming user with email ${email}`, context.requestId);

    const user = await this.queryBus.execute(
      new GetUserByEmailQuery(email) as any,
    );

    if (!user) {
      Logger.error(`User with email ${email} not found`, context.requestId);
      throw new InvalidCredentialsException();
    }

    if (user.isConfirmed()) {
      throw new UserAlreadyConfirmedException();
    }

    await this.commandBus.execute(
      new ConfirmRegisterCommand(email, confirmationCode),
    );

    await this.commandBus.execute(
      new UpdateUserCommand(user.getUuid(), {
        isConfirmed: true,
        isEmailVerified: true,
        updatedAt: new Date() as any,
      } as any),
    );

    Logger.log(
      `User with email ${email} confirmed successfully`,
      context.requestId,
    );

    return {
      message: 'User confirmed successfully',
    };
  }
}
