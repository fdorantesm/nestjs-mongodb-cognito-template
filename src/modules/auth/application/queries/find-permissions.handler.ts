import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InjectService } from '@/core/application/inject-service.decorator';
import type { PermissionsService } from '@/modules/auth/domain/interfaces/permissions.service.interface';
import { PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/permissions.service.interface';
import { FindPermissionsQuery } from '@/modules/auth/domain/queries/find-permissions.query';
import type { PermissionEntity } from '@/modules/auth/domain/entities/permission.entity';

@QueryHandler(FindPermissionsQuery)
export class FindPermissionsHandler
  implements IQueryHandler<FindPermissionsQuery>
{
  constructor(
    @InjectService(PERMISSIONS_SERVICE_TOKEN)
    private readonly permissionsService: PermissionsService,
  ) {}

  public async execute(
    query: FindPermissionsQuery,
  ): Promise<PermissionEntity[]> {
    return this.permissionsService.find(query.filter);
  }
}
