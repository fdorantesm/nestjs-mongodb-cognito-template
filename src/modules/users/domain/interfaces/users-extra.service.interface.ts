import type { UserExtra } from './user-extra.interface';

export const USER_EXTRAS_SERVICE_TOKEN = 'UserExtrasService';
export const USER_EXTRAS_REPOSITORY_TOKEN = 'UserExtrasRepository';

export interface UserExtrasService {
  createIntegration(
    userId: string,
    provider: string,
    externalId: string,
    externalData?: Record<string, unknown>,
  ): Promise<UserExtra>;

  findByUserIdAndProvider(
    userId: string,
    provider: string,
  ): Promise<UserExtra | null>;

  findByExternalId(externalId: string): Promise<UserExtra | null>;

  findByUserId(userId: string): Promise<UserExtra[]>;
}
