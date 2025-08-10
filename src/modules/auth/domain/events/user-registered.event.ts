import type { Registration } from '@/modules/auth/domain/interfaces/registration.interface';

export class UserRegisteredEvent {
  constructor(
    public readonly identityId: string,
    public readonly registration: Omit<Registration, 'password'>,
  ) {}
}
