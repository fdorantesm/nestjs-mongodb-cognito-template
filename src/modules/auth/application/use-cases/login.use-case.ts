import { Logger } from '@nestjs/common';

import { UseCase } from '@/core/application/case.decorator';
import { InjectService } from '@/core/application/inject-service.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { IdentityService } from '@/modules/auth/infrastructure/services/identity.service';

@UseCase()
export class LoginUseCase implements Executable {
  constructor(
    @InjectService('IdentityService')
    private readonly identityService: IdentityService,
  ) {}

  public async execute(
    context: Context,
    email: string,
    password: string,
  ): Promise<unknown> {
    Logger.log(`Logging in user with email ${email}`, context.requestId);

    const response = await this.identityService.initiateAuth(email, password);

    Logger.log(
      `User with email ${email} logged in successfully`,
      context.requestId,
    );

    return response;
  }
}
