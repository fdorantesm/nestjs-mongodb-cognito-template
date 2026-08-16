import { Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { LogoutCommand } from '@/modules/identity/domain/commands/logout.command';

@UseCase()
export class LogoutUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(context: Context, accessToken: string): Promise<void> {
    Logger.log('LogoutUseCase', context.requestId);

    await this.commandBus.execute(new LogoutCommand(accessToken));
  }
}
