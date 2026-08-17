/* eslint-disable @typescript-eslint/no-require-imports */
import type DataStore = require('nedb-promises');
import { Injectable } from '@nestjs/common';

import { BaseMemoryRepository } from '@/core/infrastructure/repositories/base.memory-repository';
import type { UserExtra } from '@/modules/users/domain/interfaces/user-extra.interface';
import { UserExtraEntity } from '@/modules/users/domain/entities/user-extra.entity';

const Datastore: typeof DataStore = require('nedb-promises');

@Injectable()
export class UserExtrasMemoryRepository extends BaseMemoryRepository<
  UserExtra,
  UserExtraEntity
> {
  constructor() {
    super(Datastore.create(), UserExtraEntity, { softDelete: true });
  }

  public async findByUserIdAndProvider(
    userId: string,
    provider: string,
  ): Promise<UserExtraEntity | null> {
    const found = await this.findOne({
      userId,
      provider,
    });
    return found ?? null;
  }

  public async findByExternalId(
    externalId: string,
  ): Promise<UserExtraEntity | null> {
    const found = await this.findOne({ externalId });
    return found ?? null;
  }

  public async findByUserId(userId: string): Promise<UserExtraEntity[]> {
    return this.find({ userId });
  }

  public async deleteByUserIdAndProvider(
    userId: string,
    provider: string,
  ): Promise<boolean> {
    return this.deleteMany({ userId, provider });
  }
}
