import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

import { UserCreatedEvent } from '@/modules/users/domain/events/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  public handle(event: UserCreatedEvent): void {
    Logger.log(
      `User ${event.email} persisted with identity ${event.identityId}`,
      'UserCreatedEventHandler',
    );
  }
}
