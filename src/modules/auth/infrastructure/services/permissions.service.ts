import { Injectable } from '@nestjs/common';

import type { Permission } from '@/modules/auth/domain/interfaces/permission.interface';
import { PermissionEntity } from '@/modules/auth/domain/entities/permission.entity';
import { PermissionsRepository } from '@/modules/auth/infrastructure/database/repositories/permissions.repository';
import { BaseService } from '@/core/infrastructure/services/base.service';
import { InjectRepository } from '@/core/application/inject-repository.decorator';

@Injectable()
export class PermissionsService extends BaseService<
  Permission,
  PermissionEntity
> {
  constructor(
    @InjectRepository('PermissionsRepository')
    private readonly permissionsRepository: PermissionsRepository,
  ) {
    super(permissionsRepository);
  }
}
