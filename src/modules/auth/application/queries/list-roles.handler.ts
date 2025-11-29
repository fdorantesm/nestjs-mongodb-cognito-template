import { Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ROLES_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/roles.service.interface';
import { InjectService } from '@/core/application/inject-service.decorator';
import { ListRolesQuery } from '@/modules/auth/domain/queries/list-roles.query';
import type { RolesService } from '@/modules/auth/domain/interfaces/roles.service.interface';

@QueryHandler(ListRolesQuery)
@Injectable()
export class ListRolesHandler implements IQueryHandler<ListRolesQuery> {
  constructor(
    @InjectService(ROLES_SERVICE_TOKEN)
    private readonly rolesService: RolesService,
  ) {}

  public async execute(query: ListRolesQuery) {
    const { filter, options } = query;

    const roles = await this.rolesService.paginate(filter, options);

    return roles;
  }
}
