import { Service } from '@/core/application/service.decorator';
import { ROLE_PERMISSIONS_REPOSITORY_TOKEN } from '@/modules/auth/domain/interfaces/role-permissions.repository.interface';
import { BaseService } from '@/core/infrastructure/services/base.service';
import { RolePermissionEntity } from '@/modules/auth/domain/entities/role-permission.entity';
import type { RolePermission } from '@/modules/auth/domain/interfaces/role-permission.interface';
import { RolePermissionsRepository } from '@/modules/auth/infrastructure/database/repositories/role-permissions.repository';
import { InjectRepository } from '@/core/application/inject-repository.decorator';

@Service()
export class RolePermissionsService extends BaseService<
  RolePermission,
  RolePermissionEntity
> {
  constructor(
    @InjectRepository(ROLE_PERMISSIONS_REPOSITORY_TOKEN)
    private readonly rolePermissionsRepository: RolePermissionsRepository,
  ) {
    super(rolePermissionsRepository);
  }
}
