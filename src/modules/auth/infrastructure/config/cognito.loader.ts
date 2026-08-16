import { registerAs } from '@nestjs/config';

export const cognitoLoader = registerAs('cognito', () => ({
  region: process.env.COGNITO_REGION,
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  clientId: process.env.COGNITO_CLIENT_ID,
  clientSecret: process.env.COGNITO_CLIENT_SECRET,
}));
