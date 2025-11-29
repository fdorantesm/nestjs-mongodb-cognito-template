/* eslint-disable @typescript-eslint/no-require-imports */
import type DataStore = require('nedb-promises');
import { Injectable } from '@nestjs/common';

import { BaseMemoryRepository } from '@/core/infrastructure/repositories/base.memory-repository';
import type { Role } from '@/modules/auth/domain/interfaces/role.interface';
import { RoleEntity } from '@/modules/auth/domain/entities/role.entity';

const Datastore: typeof DataStore = require('nedb-promises');

@Injectable()
export class RolesMemoryRepository extends BaseMemoryRepository<
  Role,
  RoleEntity
> {
  constructor() {
    super(Datastore.create(), RoleEntity, { softDelete: true });
  }
}
