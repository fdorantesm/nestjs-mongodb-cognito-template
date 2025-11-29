import type { SettingEntity } from '@/modules/settings/domain/entities';

export class GetAllSettingsQuery {
  constructor(public readonly filter: Partial<SettingEntity> = {}) {}
}
