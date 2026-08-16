/* eslint-disable @typescript-eslint/no-require-imports */
import type DataStore = require('nedb-promises');
import { Injectable } from '@nestjs/common';

import { BaseMemoryRepository } from '@/core/infrastructure/repositories/base.memory-repository';
import type { User } from '@/modules/users/domain/interfaces/user.interface';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';

const Datastore: typeof DataStore = require('nedb-promises');

@Injectable()
export class UsersMemoryRepository extends BaseMemoryRepository<
  User,
  UserEntity
> {
  constructor() {
    super(Datastore.create(), UserEntity, { softDelete: true });
  }
}
