/* eslint-disable @typescript-eslint/no-require-imports */
import type DataStore = require('nedb-promises');
import { Injectable } from '@nestjs/common';

import { BaseMemoryRepository } from '@/core/infrastructure/repositories/base.memory-repository';
import type { Permission } from '@/modules/auth/domain/interfaces/permission.interface';
import { PermissionEntity } from '@/modules/auth/domain/entities/permission.entity';

const Datastore: typeof DataStore = require('nedb-promises');

@Injectable()
export class PermissionsMemoryRepository extends BaseMemoryRepository<
  Permission,
  PermissionEntity
> {
  constructor() {
    super(Datastore.create(), PermissionEntity, { softDelete: true });
  }
}
