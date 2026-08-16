import { QueryBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import { GetPublicSettingsQuery } from '@/modules/settings/domain/queries';
import type { SettingEntity } from '@/modules/settings/domain/entities';

@UseCase()
export class GetPublicSettingsUseCase implements Executable {
  constructor(private readonly queryBus: QueryBus) {}

  public async execute(_context: Context): Promise<unknown> {
    const settings = await this.queryBus.execute<
      GetPublicSettingsQuery,
      SettingEntity[]
    >(new GetPublicSettingsQuery());

    return settings.map((setting) => setting.toJson());
  }
}
