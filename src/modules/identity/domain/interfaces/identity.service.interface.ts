import type {
  CreateIdentityUserInput,
  CreateIdentityUserResult,
  IdentityUser,
  UpdateIdentityUserInput,
} from '@/modules/identity/domain/types/identity-user.types';

export const IDENTITY_SERVICE_TOKEN = 'IdentityService';

export interface IdentityService {
  createUser(input: CreateIdentityUserInput): Promise<CreateIdentityUserResult>;
  updateUser(input: UpdateIdentityUserInput): Promise<void>;
  deleteUser(username: string): Promise<void>;
  getUser(username: string): Promise<IdentityUser>;
  initiateAuth(username: string, password: string): Promise<any>;
  challenge(payload: any): Promise<any>;
  register(params: any): Promise<any>;
  confirmRegister(payload: {
    email: string;
    confirmationCode: string;
  }): Promise<any>;
  validateAccessToken(token: string): Promise<any>;
  refreshToken(
    refreshToken: string,
    identityId: string,
  ): Promise<{
    accessToken: string;
    expiresIn: number;
  }>;
  logout(accessToken: string): Promise<void>;
  associateSoftwareToken(session: string): Promise<any>;
}
