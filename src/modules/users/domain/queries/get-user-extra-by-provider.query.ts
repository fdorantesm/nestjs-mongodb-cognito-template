import { IQuery } from '@nestjs/cqrs';

export class GetUserExtraByProviderQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly provider: string,
  ) {}
}
