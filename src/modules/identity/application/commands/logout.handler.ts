import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { InjectService } from '@/core/application/inject-service.decorator';
import { LogoutCommand } from '@/modules/identity/domain/commands/logout.command';
import type { IdentityService } from '@/modules/identity/domain/interfaces/identity.service.interface';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    @InjectService('IdentityService')
    private readonly identityService: IdentityService,
  ) {}

  public async execute(command: LogoutCommand): Promise<void> {
    Logger.log('LogoutHandler', command.accessToken);

    await this.identityService.logout(command.accessToken);
  }
}
