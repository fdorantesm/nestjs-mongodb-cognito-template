/* eslint-disable @typescript-eslint/no-require-imports */
import type DataStore = require('nedb-promises');
import { Injectable } from '@nestjs/common';

import { BaseMemoryRepository } from '@/core/infrastructure/repositories/base.memory-repository';
import type { Profile } from '@/modules/users/domain/interfaces/profile.interface';
import { ProfileEntity } from '@/modules/users/domain/entities/profile.entity';

const Datastore: typeof DataStore = require('nedb-promises');

@Injectable()
export class ProfilesMemoryRepository extends BaseMemoryRepository<
  Profile,
  ProfileEntity
> {
  constructor() {
    super(Datastore.create(), ProfileEntity, { softDelete: true });
  }
}
