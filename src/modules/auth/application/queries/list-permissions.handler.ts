import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/permissions.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { ListPermissionsQuery } from '@/modules/auth/domain/queries/list-permissions.query';
import type { PermissionsService } from '@/modules/auth/domain/interfaces/permissions.service.interface';

@QueryHandler(ListPermissionsQuery)
@Injectable()
export class ListPermissionsHandler
  implements IQueryHandler<ListPermissionsQuery>
{
  constructor(
    @InjectService(PERMISSIONS_SERVICE_TOKEN)
    private readonly permissionsService: PermissionsService,
  ) {}

  public async execute(query: ListPermissionsQuery) {
    const { filter, options } = query;

    const permissions = await this.permissionsService.paginate(filter, options);

    return permissions;
  }
}
