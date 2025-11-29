import { SettingKey, SettingType } from '@/modules/settings/domain/enums';

export class InitializeSettingCommand {
  constructor(
    public readonly key: SettingKey,
    public readonly value: string,
    public readonly type: SettingType,
    public readonly description?: string,
    public readonly isPublic: boolean = true,
  ) {}
}
