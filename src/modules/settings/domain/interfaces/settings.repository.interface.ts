import type { Setting } from '@/modules/settings/domain/interfaces/setting.interface';
import type { SettingEntity } from '@/modules/settings/domain/entities/setting.entity';
import type { Crud } from '@/core/domain/crud.interface';

export const SETTINGS_REPOSITORY_TOKEN = 'SettingsRepository';

export interface SettingsRepository extends Crud<Setting, SettingEntity> {
  findByKey(key: string): Promise<SettingEntity | null>;
}
