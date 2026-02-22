import { CommandBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UseCase } from '@/core/application/case.decorator';
import type { Executable } from '@/core/domain/executable.interface';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { AssociateSoftwareTokenCommand } from '@/modules/identity/domain/commands/associate-software-token.command';
import { RespondChallengeCommand } from '@/modules/identity/domain/commands/respond-challenge.command';

@UseCase()
export class RespondChallengeUseCase implements Executable {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly configService: ConfigService,
  ) {}

  public async execute(context: Context, payload): Promise<unknown> {
    Logger.log('RespondChallengeUseCase', context.requestId);

    const response = await this.commandBus.execute(
      new RespondChallengeCommand(payload),
    );

    Logger.log(
      `Challenge response: ${JSON.stringify(response)}`,
      context.requestId,
    );

    if (response.challengeName === 'MFA_SETUP') {
      Logger.log(
        'MFA_SETUP challenge detected, associating software token',
        context.requestId,
      );

      const mfaResponse = await this.commandBus.execute(
        new AssociateSoftwareTokenCommand(response.session),
      );

      const issuer = this.configService.get<string>('APP_NAME') || 'Komunitam';
      const otpauthUrl = `otpauth://totp/${issuer}:${payload.username}?secret=${mfaResponse.secretCode}&issuer=${issuer}`;

      return {
        challengeName: 'MFA_SETUP',
        session: mfaResponse.session,
        mfaRequired: true,
        mfaSetup: {
          otpauthUrl,
          secret: mfaResponse.secretCode,
        },
      };
    }

    return response;
  }
}
