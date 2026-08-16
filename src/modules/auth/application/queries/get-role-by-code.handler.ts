import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InjectService } from '@/core/application/inject-service.decorator';
import {
  ROLES_SERVICE_TOKEN,
  type RolesService,
} from '@/modules/auth/domain/interfaces/roles.service.interface';
import { GetRoleByCodeQuery } from '@/modules/auth/domain/queries/get-role-by-code.query';
import type { RoleEntity } from '@/modules/auth/domain/entities/role.entity';

@QueryHandler(GetRoleByCodeQuery)
export class GetRoleByCodeHandler implements IQueryHandler<GetRoleByCodeQuery> {
  constructor(
    @InjectService(ROLES_SERVICE_TOKEN)
    private readonly rolesService: RolesService,
  ) {}

  public async execute(query: GetRoleByCodeQuery): Promise<RoleEntity | null> {
    return this.rolesService.findOne({ code: query.code });
  }
}
