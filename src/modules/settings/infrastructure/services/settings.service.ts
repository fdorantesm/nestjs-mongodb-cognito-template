import { Service } from '@/core/application/service.decorator';
import { SETTINGS_REPOSITORY_TOKEN } from '@/modules/settings/domain/interfaces/settings.repository.interface';
import { BaseService } from '@/core/infrastructure/services/base.service';
import { InjectRepository } from '@/core/application/inject-repository.decorator';
import { SettingEntity } from '@/modules/settings/domain/entities';
import { SettingsRepository } from '@/modules/settings/infrastructure/database/repositories';
import { SettingKey } from '@/modules/settings/domain/enums';
import { Setting } from '@/modules/settings/domain/interfaces';

@Service()
export class SettingsService extends BaseService<Setting, SettingEntity> {
  constructor(
    @InjectRepository(SETTINGS_REPOSITORY_TOKEN)
    private readonly settingsRepository: SettingsRepository,
  ) {
    super(settingsRepository);
  }

  public async findByKey(key: string): Promise<SettingEntity | null> {
    return this.settingsRepository.findByKey(key as SettingKey);
  }

  public async findPublicSettings(): Promise<SettingEntity[]> {
    return this.settingsRepository.findPublicSettings();
  }

  public async findAll(): Promise<SettingEntity[]> {
    return this.settingsRepository.find();
  }
}
