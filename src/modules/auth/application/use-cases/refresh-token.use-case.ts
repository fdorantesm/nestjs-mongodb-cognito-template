import { CommandBus } from '@nestjs/cqrs';

import type { Context } from '@/core/domain/interfaces/context.interface';
import { RefreshTokenCommand } from '@/modules/identity/domain/commands/refresh-token.command';
import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';

@UseCase()
export class RefreshTokenUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public execute(context: Context, refreshToken: string, identityId?: string) {
    return this.commandBus.execute(
      new RefreshTokenCommand(refreshToken, identityId),
    );
  }
}
