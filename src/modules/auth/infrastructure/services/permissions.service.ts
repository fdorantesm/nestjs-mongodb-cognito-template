import { Service } from '@/core/application/service.decorator';
import { PERMISSIONS_REPOSITORY_TOKEN } from '@/modules/auth/domain/interfaces/permissions.repository.interface';
import type { Permission } from '@/modules/auth/domain/interfaces/permission.interface';
import { PermissionEntity } from '@/modules/auth/domain/entities/permission.entity';
import { PermissionsRepository } from '@/modules/auth/infrastructure/database/repositories/permissions.repository';
import { BaseService } from '@/core/infrastructure/services/base.service';
import { InjectRepository } from '@/core/application/inject-repository.decorator';

@Service()
export class PermissionsService extends BaseService<
  Permission,
  PermissionEntity
> {
  constructor(
    @InjectRepository(PERMISSIONS_REPOSITORY_TOKEN)
    private readonly permissionsRepository: PermissionsRepository,
  ) {
    super(permissionsRepository);
  }
}
