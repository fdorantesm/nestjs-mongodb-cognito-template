import { CommandBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import { UpdateSettingCommand } from '@/modules/settings/domain/commands';
import type { SettingKey } from '@/modules/settings/domain/enums';

export interface UpdateSettingPayload {
  key: SettingKey;
  value: string;
}

@UseCase()
export class UpdateSettingUseCase implements Executable {
  constructor(private readonly commandBus: CommandBus) {}

  public async execute(
    context: Context,
    payload: UpdateSettingPayload,
  ): Promise<unknown> {
    const command = new UpdateSettingCommand(payload.key, payload.value);

    return this.commandBus.execute(command);
  }
}
