import { UseCase } from '@/core/application/case.decorator';
import { InjectService } from '@/core/application/inject-service.decorator';
import { InvalidCredentialsException } from '@/core/domain/exceptions/invalid-credentials';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { UserAlreadyConfirmedException } from '@/modules/auth/domain/exceptions/user-already-confirmed.exception';
import type { IdentityService } from '@/modules/auth/infrastructure/services/identity.service';
import { UsersService } from '@/modules/auth/infrastructure/services/users.service';
import { Inject, Logger } from '@nestjs/common';

@UseCase()
export class ConfirmRegisterUseCase implements Executable {
  constructor(
    @InjectService('UsersService')
    private readonly usersService: UsersService,
    @Inject('IdentityService')
    private readonly identityService: IdentityService,
  ) {}

  public async execute(
    context: Context,
    email: string,
    confirmationCode: string,
  ): Promise<unknown> {
    Logger.log(`Confirming user with email ${email}`, context.requestId);

    const user = await this.usersService.findOne({
      email,
    });

    if (!user) {
      Logger.error(`User with email ${email} not found`, context.requestId);
      throw new InvalidCredentialsException();
    }

    if (user.isConfirmed()) {
      throw new UserAlreadyConfirmedException();
    }

    await this.identityService.confirmRegister({ email, confirmationCode });

    await this.usersService.update(
      { email },
      { isConfirmed: true, isEmailVerified: true, updatedAt: new Date() },
    );

    Logger.log(
      `User with email ${email} confirmed successfully`,
      context.requestId,
    );

    return {
      message: 'User confirmed successfully',
    };
  }
}
