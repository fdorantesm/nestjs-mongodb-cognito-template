import { registerAs } from '@nestjs/config';

export const cognitoLoader = registerAs('cognito', () => {
  const region = process.env.COGNITO_REGION;
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const clientId = process.env.COGNITO_CLIENT_ID;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET;

  // fail fast if required values are missing; the region is needed by aws-sdk
  if (!region) {
    throw new Error('Environment variable COGNITO_REGION is required');
  }

  if (!userPoolId) {
    throw new Error('Environment variable COGNITO_USER_POOL_ID is required');
  }

  return {
    region,
    userPoolId,
    clientId,
    clientSecret,
  };
});
