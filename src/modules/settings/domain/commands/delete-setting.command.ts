import { SettingKey } from '@/modules/settings/domain/enums';

export class DeleteSettingCommand {
  constructor(
    public readonly key: SettingKey,
    public readonly deletedBy?: string,
  ) {}
}
