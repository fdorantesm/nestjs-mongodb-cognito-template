import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { RefreshTokenCommand } from '@/modules/identity/domain/commands/refresh-token.command';
import { InjectService } from '@/core/application/inject-service.decorator';
import {
  IdentityService,
  IDENTITY_SERVICE_TOKEN,
} from '@/modules/identity/domain/interfaces/identity.service.interface';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    @InjectService(IDENTITY_SERVICE_TOKEN)
    private readonly identityService: IdentityService,
  ) {}

  public async execute(command: RefreshTokenCommand) {
    const response = await this.identityService.refreshToken(
      command.refreshToken,
      command.identityId,
    );

    return {
      ...response,
      refreshToken: command.refreshToken, // Cognito doesn't return a new refresh token, reuse the original
      tokenType: 'Bearer',
    };
  }
}
