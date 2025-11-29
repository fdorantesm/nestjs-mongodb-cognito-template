/* eslint-disable @typescript-eslint/no-require-imports */
import type DataStore = require('nedb-promises');
import { Injectable } from '@nestjs/common';

import { BaseMemoryRepository } from '@/core/infrastructure/repositories/base.memory-repository';
import type { RolePermission } from '@/modules/auth/domain/interfaces/role-permission.interface';
import { RolePermissionEntity } from '@/modules/auth/domain/entities/role-permission.entity';

const Datastore: typeof DataStore = require('nedb-promises');

@Injectable()
export class RolePermissionsMemoryRepository extends BaseMemoryRepository<
  RolePermission,
  RolePermissionEntity
> {
  constructor() {
    super(Datastore.create(), RolePermissionEntity, { softDelete: true });
  }

  public async findByRoleId(roleId: string): Promise<RolePermissionEntity[]> {
    const documents = await this.store.find({ roleId, isDeleted: false });
    return documents.map((doc) => new RolePermissionEntity(doc));
  }
}
