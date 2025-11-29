import { CommandBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import { DeleteSettingCommand } from '@/modules/settings/domain/commands';
import type { SettingKey } from '@/modules/settings/domain/enums';

@UseCase()
export class DeleteSettingUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(
    context: Context,
    payload: DeleteSettingPayload,
  ): Promise<void> {
    const command = new DeleteSettingCommand(payload.key, context.userId);

    await this.commandBus.execute(command);
  }
}

export interface DeleteSettingPayload {
  key: SettingKey;
}
