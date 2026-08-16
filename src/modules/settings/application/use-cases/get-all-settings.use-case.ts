import { QueryBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import { GetAllSettingsQuery } from '@/modules/settings/domain/queries';
import type { SettingEntity } from '@/modules/settings/domain/entities';
import type { Setting } from '@/modules/settings/domain/interfaces';

@UseCase()
export class GetAllSettingsUseCase implements Executable {
  constructor(private readonly queryBus: QueryBus) {}

  public async execute(_context: Context): Promise<Setting[]> {
    const settings = await this.queryBus.execute<
      GetAllSettingsQuery,
      SettingEntity[]
    >(new GetAllSettingsQuery());

    return settings.map((setting) => setting.toJson());
  }
}
