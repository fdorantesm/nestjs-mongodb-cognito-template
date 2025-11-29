import { SettingKey } from '@/modules/settings/domain/enums';

export class UpdateSettingCommand {
  constructor(
    public readonly key: SettingKey,
    public readonly value: string,
    public readonly updatedBy?: string,
  ) {}
}
