import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UuidService } from 'nestjs-uuid';

import { SETTINGS_SERVICE_TOKEN } from '@/modules/settings/domain/interfaces/settings.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { InitializeSettingCommand } from '@/modules/settings/domain/commands';
import { SettingEntity } from '@/modules/settings/domain/entities';
import type { SettingsService } from '@/modules/settings/domain/interfaces/settings.service.interface';

@CommandHandler(InitializeSettingCommand)
export class InitializeSettingHandler
  implements ICommandHandler<InitializeSettingCommand>
{
  constructor(
    @InjectService(SETTINGS_SERVICE_TOKEN)
    private readonly settingsService: SettingsService,
    private readonly uuidService: UuidService,
  ) {}

  async execute(command: InitializeSettingCommand): Promise<SettingEntity> {
    // Check if setting already exists
    const existingSetting = await this.settingsService.findByKey(command.key);

    if (existingSetting) {
      return existingSetting;
    }

    // Create new setting
    const setting = new SettingEntity({
      uuid: this.uuidService.generate(),
      key: command.key,
      value: command.value,
      type: command.type,
      description: command.description,
      isPublic: command.isPublic,
    });

    return this.settingsService.create(setting.toObject());
  }
}
