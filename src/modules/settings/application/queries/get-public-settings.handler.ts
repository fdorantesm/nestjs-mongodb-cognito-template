import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectService } from '@/core/application/inject-service.decorator';
import { GetPublicSettingsQuery } from '../../domain/queries';
import { SettingEntity } from '../../domain/entities';
import type { SettingsService } from '../../domain/interfaces/settings.service.interface';
import { SETTINGS_SERVICE_TOKEN } from '../../domain/interfaces/settings.service.interface';

@QueryHandler(GetPublicSettingsQuery)
export class GetPublicSettingsHandler
  implements IQueryHandler<GetPublicSettingsQuery>
{
  constructor(
    @InjectService(SETTINGS_SERVICE_TOKEN)
    private readonly settingsService: SettingsService,
  ) {}

  async execute(): Promise<SettingEntity[]> {
    return this.settingsService.findPublicSettings();
  }
}
