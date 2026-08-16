import { QueryBus } from '@nestjs/cqrs';
import { Logger, NotFoundException } from '@nestjs/common';

import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { GetRoleByIdQuery } from '@/modules/auth/domain/queries/get-role-by-id.query';
import { RoleEntity } from '@/modules/auth/domain/entities/role.entity';

@UseCase()
export class GetRoleByIdUseCase implements Executable {
  constructor(private readonly queryBus: QueryBus) {}

  public async execute(context: Context, roleId: string): Promise<any> {
    Logger.log(`Getting role with id ${roleId}`, context.requestId);

    const role = await this.queryBus.execute<GetRoleByIdQuery, RoleEntity>(
      new GetRoleByIdQuery(roleId),
    );

    if (!role) {
      throw new NotFoundException(`ROLE_NOT_FOUND`);
    }

    return role.toJson();
  }
}
