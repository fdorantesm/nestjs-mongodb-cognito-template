import { QueryBus } from '@nestjs/cqrs';

import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { GetUserByIdQuery } from '@/modules/users/domain/queries/get-user-by-id.query';
import { UserNotFoundException } from '@/modules/users/domain/exceptions';

@UseCase()
export class GetUserByIdUseCase implements Executable {
  constructor(private readonly queryBus: QueryBus) {}

  public async execute(_context: Context, userId: string) {
    const user = await this.queryBus.execute(new GetUserByIdQuery(userId));

    if (!user) {
      throw new UserNotFoundException(userId);
    }

    return user.toJson();
  }
}
