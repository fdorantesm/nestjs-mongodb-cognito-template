import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { InjectService } from '@/core/application/inject-service.decorator';
import { DeleteSettingCommand } from '@/modules/settings/domain/commands';
import {
  SETTINGS_SERVICE_TOKEN,
  type SettingsService,
} from '@/modules/settings/domain/interfaces';

@CommandHandler(DeleteSettingCommand)
export class DeleteSettingHandler
  implements ICommandHandler<DeleteSettingCommand>
{
  constructor(
    @InjectService(SETTINGS_SERVICE_TOKEN)
    private readonly settingsService: SettingsService,
  ) {}

  async execute(command: DeleteSettingCommand): Promise<void> {
    const setting = await this.settingsService.findByKey(command.key);

    if (!setting) {
      throw new Error(`Setting with key ${command.key} not found`);
    }

    await this.settingsService.delete({ key: command.key });
  }
}
