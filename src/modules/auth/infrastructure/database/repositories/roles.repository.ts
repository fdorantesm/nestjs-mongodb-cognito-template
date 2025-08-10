import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { BaseRepository } from '@/core/infrastructure/repositories/base.repository';
import { RoleEntity } from '@/modules/auth/domain/entities/role.entity';
import type { Role } from '@/modules/auth/domain/interfaces/role.interface';
import { RoleDocument } from '@/modules/auth/infrastructure/database/models/roles.model';

@Injectable()
export class RolesRepository extends BaseRepository<Role, RoleEntity> {
  constructor(
    @InjectModel(RoleDocument.name)
    readonly roleModel: PaginateModel<RoleDocument>,
  ) {
    super(roleModel, RoleEntity);
  }
}
