import type { Crud } from '@/core/domain/crud.interface';
import type { Setting } from '@/modules/settings/domain/interfaces/setting.interface';
import type { SettingEntity } from '@/modules/settings/domain/entities/setting.entity';

export const SETTINGS_SERVICE_TOKEN = 'SettingsService';

export interface SettingsService extends Crud<Setting, SettingEntity> {
  findByKey(key: string): Promise<SettingEntity | null>;
  findPublicSettings(): Promise<SettingEntity[]>;
  findAll(): Promise<SettingEntity[]>;
}
