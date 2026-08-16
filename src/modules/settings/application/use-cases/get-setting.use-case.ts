import { NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import type { Executable } from '@/core/domain/executable.interface';
import { GetSettingQuery } from '@/modules/settings/domain/queries';
import type { SettingKey } from '@/modules/settings/domain/enums';
import type { Setting } from '@/modules/settings/domain/interfaces';

@UseCase()
export class GetSettingUseCase implements Executable {
  constructor(private readonly queryBus: QueryBus) {}

  public async execute(_context: Context, key: SettingKey): Promise<Setting> {
    const setting = await this.queryBus.execute(new GetSettingQuery(key));

    if (!setting) {
      throw new NotFoundException('SETTING_NOT_FOUND');
    }

    return setting?.toJson();
  }
}
