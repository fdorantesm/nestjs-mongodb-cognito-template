import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConflictException, Logger } from '@nestjs/common';
import { UuidService } from 'nestjs-uuid';

import type { Context } from '@/core/domain/interfaces/context.interface';
import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Registration } from '@/modules/auth/domain/interfaces/registration.interface';
import { RegisterIdentityUserCommand } from '@/modules/identity/domain/commands/register-identity-user.command';
import { UserAlreadyRegisteredException } from '@/modules/auth/domain/exceptions/user-already-registered.exception';
import { CreateUserCommand } from '@/modules/users/domain/commands/create-user.command';
import { Scopes } from '@/modules/auth/domain/enums/scopes.enum';
import { GetRoleByCodeQuery } from '@/modules/auth/domain/queries/get-role-by-code.query';
import { GetUserCountByEmailQuery } from '@/modules/users/domain/queries/get-user-count-by-email.query';
import type { RoleEntity } from '@/modules/auth/domain/entities/role.entity';

@UseCase()
export class RegisterUseCase implements Executable {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly uuidService: UuidService,
  ) {}

  public async execute(
    context: Context,
    registration: Registration,
  ): Promise<void> {
    Logger.log(
      `Registering user with email ${registration.email}`,
      context.requestId,
    );

    const userExists = await this.queryBus.execute<number>(
      new GetUserCountByEmailQuery(registration.email) as any,
    );

    if (userExists) {
      throw new UserAlreadyRegisteredException(
        `User with email ${registration.email} already exists`,
      );
    }

    try {
      const { UserSub } = await this.commandBus.execute(
        new RegisterIdentityUserCommand(
          registration.email,
          registration.password,
          registration.displayName,
          (registration as any).phone,
        ),
      );

      const role = await this.queryBus.execute<RoleEntity>(
        new GetRoleByCodeQuery('user') as any,
      );

      if (!role) {
        throw new Error('Default user role not found');
      }

      const userId = this.uuidService.generate();

      await this.commandBus.execute(
        new CreateUserCommand({
          uuid: userId,
          identityId: UserSub,
          email: registration.email,
          username: registration.username,
          roleId: role.getUuid(),
          scopes: [Scopes.Website],
          isEmailVerified: false,
          isPhoneVerified: false,
          isConfirmed: false,
          isActive: true,
          isVerified: false,
          profile: {
            displayName: registration.displayName,
            isPublic: true,
          },
        }),
      );

      Logger.log(
        `User with email ${registration.email} registered successfully`,
        context.requestId,
      );
    } catch (error) {
      Logger.error(
        `Error registering user with email ${registration.email}: ${error.message}`,
        context.requestId,
      );

      throw new ConflictException(
        `Error registering user with email ${registration.email}: ${error.message}`,
      );
    }
  }
}
