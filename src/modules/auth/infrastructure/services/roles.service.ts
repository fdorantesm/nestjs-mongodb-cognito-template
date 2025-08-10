import { Injectable } from '@nestjs/common';
import { BaseService } from '@/core/infrastructure/services/base.service';
import type { Role } from '@/modules/auth/domain/interfaces/role.interface';
import { RoleEntity } from '@/modules/auth/domain/entities/role.entity';
import { RolesRepository } from '@/modules/auth/infrastructure/database/repositories/roles.repository';
import { InjectRepository } from '@/core/application/inject-repository.decorator';

@Injectable()
export class RolesService extends BaseService<Role, RoleEntity> {
  constructor(
    @InjectRepository('RolesRepository')
    private readonly rolesService: RolesRepository,
  ) {
    super(rolesService);
  }
}
