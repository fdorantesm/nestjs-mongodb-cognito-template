import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { BaseRepository } from '@/core/infrastructure/repositories/base.repository';
import { PermissionDocument } from '@/modules/auth/infrastructure/database/models/permission.model';
import type { Permission } from '@/modules/auth/domain/interfaces/permission.interface';
import { PermissionEntity } from '@/modules/auth/domain/entities/permission.entity';

@Injectable()
export class PermissionsRepository extends BaseRepository<
  Permission,
  PermissionEntity
> {
  constructor(
    @InjectModel(PermissionDocument.name)
    readonly permissionModel: PaginateModel<PermissionDocument>,
  ) {
    super(permissionModel, PermissionEntity);
  }
}
