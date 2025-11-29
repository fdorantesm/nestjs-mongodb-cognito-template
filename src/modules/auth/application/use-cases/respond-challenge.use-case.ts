import { CommandBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { RespondChallengeCommand } from '@/modules/identity/domain/commands/respond-challenge.command';

@UseCase()
export class RespondChallengeUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(context: Context, payload): Promise<unknown> {
    Logger.log('RespondChallengeUseCase', context.requestId);

    const response = await this.commandBus.execute(
      new RespondChallengeCommand(payload),
    );

    Logger.log('Challenge response sent successfully', context.requestId);

    return response;
  }
}
