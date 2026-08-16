import { cognitoLoader } from './cognito.loader';

describe('cognitoLoader', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('throws when region is not defined', () => {
    delete process.env.COGNITO_REGION;
    expect(() => cognitoLoader()).toThrow(
      'Environment variable COGNITO_REGION is required',
    );
  });

  it('throws when userPoolId is not defined', () => {
    process.env.COGNITO_REGION = 'us-east-1';
    delete process.env.COGNITO_USER_POOL_ID;
    expect(() => cognitoLoader()).toThrow(
      'Environment variable COGNITO_USER_POOL_ID is required',
    );
  });

  it('returns configuration when variables are present', () => {
    process.env.COGNITO_REGION = 'us-east-1';
    process.env.COGNITO_USER_POOL_ID = 'pool';
    process.env.COGNITO_CLIENT_ID = 'client';
    process.env.COGNITO_CLIENT_SECRET = 'secret';

    const config = cognitoLoader();
    expect(config).toEqual({
      region: 'us-east-1',
      userPoolId: 'pool',
      clientId: 'client',
      clientSecret: 'secret',
    });
  });
});
