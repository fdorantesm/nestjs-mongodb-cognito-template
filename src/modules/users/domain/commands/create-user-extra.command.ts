import { ICommand } from '@nestjs/cqrs';

export class CreateUserExtraCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly provider: string,
    public readonly externalId: string,
    public readonly externalData?: Record<string, unknown>,
  ) {}
}
