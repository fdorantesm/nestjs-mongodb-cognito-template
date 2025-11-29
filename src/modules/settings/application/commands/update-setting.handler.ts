import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectService } from '@/core/application/inject-service.decorator';
import { UpdateSettingCommand } from '../../domain/commands';
import { SettingEntity } from '../../domain/entities';
import type { SettingsService } from '../../domain/interfaces/settings.service.interface';
import { SETTINGS_SERVICE_TOKEN } from '../../domain/interfaces/settings.service.interface';

@CommandHandler(UpdateSettingCommand)
export class UpdateSettingHandler
  implements ICommandHandler<UpdateSettingCommand>
{
  constructor(
    @InjectService(SETTINGS_SERVICE_TOKEN)
    private readonly settingsService: SettingsService,
  ) {}

  async execute(command: UpdateSettingCommand): Promise<SettingEntity> {
    const setting = await this.settingsService.findByKey(command.key);

    if (!setting) {
      throw new Error(`Setting with key ${command.key} not found`);
    }

    setting.updateValue(command.value, command.updatedBy);

    return this.settingsService.update({ key: command.key }, setting.toJson());
  }
}
