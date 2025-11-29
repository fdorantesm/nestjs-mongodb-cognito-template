export interface Context {
  [x: string]: unknown;
  userId?: string;
  identityId?: string;
  roleName?: string;
  requestId: string;
  timestamp: number;
}
