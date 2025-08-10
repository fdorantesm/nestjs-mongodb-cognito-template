import { Logger } from '@nestjs/common';

import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { IdentityService } from '@/modules/auth/infrastructure/services/identity.service';
import { InjectService } from '@/core/application/inject-service.decorator';

@UseCase()
export class RespondChallengeUseCase implements Executable {
  constructor(
    @InjectService('IdentityService')
    private readonly identityService: IdentityService,
  ) {}

  public async execute(context: Context, payload): Promise<unknown> {
    Logger.log('RespondChallengeUseCase', context.requestId);

    const response = await this.identityService.challenge(payload);

    Logger.log('Challenge response sent successfully', context.requestId);

    return response;
  }
}
