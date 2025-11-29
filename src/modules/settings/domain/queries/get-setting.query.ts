import { SettingKey } from '@/modules/settings/domain/enums';

export class GetSettingQuery {
  constructor(public readonly key: SettingKey) {}
}
