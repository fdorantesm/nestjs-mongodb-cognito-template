import { Service } from '@/core/application/service.decorator';
import { ROLES_REPOSITORY_TOKEN } from '@/modules/auth/domain/interfaces/roles.repository.interface';
import { BaseService } from '@/core/infrastructure/services/base.service';
import type { Role } from '@/modules/auth/domain/interfaces/role.interface';
import { RoleEntity } from '@/modules/auth/domain/entities/role.entity';
import { RolesRepository } from '@/modules/auth/infrastructure/database/repositories/roles.repository';
import { InjectRepository } from '@/core/application/inject-repository.decorator';
import type { RolesService as IRolesService } from '@/modules/auth/domain/interfaces/roles.service.interface';

@Service()
export class RolesService
  extends BaseService<Role, RoleEntity>
  implements IRolesService
{
  constructor(
    @InjectRepository(ROLES_REPOSITORY_TOKEN)
    private readonly rolesService: RolesRepository,
  ) {
    super(rolesService);
  }
}
