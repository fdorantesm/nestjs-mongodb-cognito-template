import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { Repository } from '@/core/application/repository.decorator';
import { BaseRepository } from '@/core/infrastructure/repositories/base.repository';
import type { Setting } from '@/modules/settings/domain/interfaces';
import { SettingEntity } from '@/modules/settings/domain/entities';
import { SettingModel } from '@/modules/settings/infrastructure/database/models';
import type { SettingKey } from '@/modules/settings/domain/enums';

@Repository()
export class SettingsRepository extends BaseRepository<Setting, SettingEntity> {
  constructor(
    @InjectModel(SettingModel.name)
    private readonly settingsModel: PaginateModel<SettingModel>,
  ) {
    super(settingsModel, SettingEntity);
  }

  async findByKey(key: SettingKey): Promise<SettingEntity | null> {
    const document = await this.settingsModel.findOne({ key }).exec();
    return document ? this.toEntity(document) : null;
  }

  async findPublicSettings(): Promise<SettingEntity[]> {
    const documents = await this.settingsModel.find({ isPublic: true }).exec();
    return documents.map((doc) => this.toEntity(doc));
  }

  async findAll(): Promise<SettingEntity[]> {
    const documents = await this.settingsModel.find().exec();
    return documents.map((doc) => this.toEntity(doc));
  }

  protected toEntity(document: SettingModel): SettingEntity {
    return new SettingEntity({
      uuid: document.uuid,
      key: document.key,
      value: document.value,
      type: document.type,
      description: document.description,
      isPublic: document.isPublic,
      updatedBy: document.updatedBy,
    });
  }
}
