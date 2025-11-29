import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectService } from '@/core/application/inject-service.decorator';
import { GetSettingQuery } from '../../domain/queries';
import { SettingEntity } from '../../domain/entities';
import type { SettingsService } from '../../domain/interfaces/settings.service.interface';
import { SETTINGS_SERVICE_TOKEN } from '../../domain/interfaces/settings.service.interface';

@QueryHandler(GetSettingQuery)
export class GetSettingHandler implements IQueryHandler<GetSettingQuery> {
  constructor(
    @InjectService(SETTINGS_SERVICE_TOKEN)
    private readonly settingsService: SettingsService,
  ) {}

  async execute(query: GetSettingQuery): Promise<SettingEntity | null> {
    return this.settingsService.findByKey(query.key);
  }
}
