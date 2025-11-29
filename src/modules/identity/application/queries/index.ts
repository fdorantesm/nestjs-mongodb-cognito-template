export * from './get-identity-user.handler';
export * from './validate-access-token.query-handler';
export * from './get-cognito-user.query-handler';

import { ValidateAccessTokenQueryHandler } from './validate-access-token.query-handler';
import { GetCognitoUserQueryHandler } from './get-cognito-user.query-handler';

export const queryHandlers = [
  ValidateAccessTokenQueryHandler,
  GetCognitoUserQueryHandler,
];
