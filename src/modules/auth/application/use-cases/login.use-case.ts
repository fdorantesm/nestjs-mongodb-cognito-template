import { CommandBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { InitiateAuthCommand } from '@/modules/identity/domain/commands/initiate-auth.command';

@UseCase()
export class LoginUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(
    context: Context,
    email: string,
    password: string,
  ): Promise<unknown> {
    Logger.log(`Logging in user with email ${email}`, context.requestId);

    const response = await this.commandBus.execute(
      new InitiateAuthCommand(email, password),
    );

    Logger.log(
      `User with email ${email} logged in successfully`,
      context.requestId,
    );

    return response;
  }
}
