/* eslint-disable @typescript-eslint/no-require-imports */
import type DataStore = require('nedb-promises');
import { Injectable } from '@nestjs/common';

import { BaseMemoryRepository } from '@/core/infrastructure/repositories/base.memory-repository';
import type { Setting } from '@/modules/settings/domain/interfaces';
import { SettingEntity } from '@/modules/settings/domain/entities';

const Datastore: typeof DataStore = require('nedb-promises');

@Injectable()
export class SettingsMemoryRepository extends BaseMemoryRepository<
  Setting,
  SettingEntity
> {
  constructor() {
    super(Datastore.create(), SettingEntity, { softDelete: true });
  }

  async findByKey(key: string): Promise<SettingEntity | null> {
    const documents = await this.store.find({ key });
    return documents.length > 0 ? new SettingEntity(documents[0]) : null;
  }

  async findPublicSettings(): Promise<SettingEntity[]> {
    const documents = await this.store.find({ isPublic: true });
    return documents.map((doc) => new SettingEntity(doc));
  }

  async findAll(): Promise<SettingEntity[]> {
    const documents = await this.store.find({});
    return documents.map((doc) => new SettingEntity(doc));
  }
}
