# Refresh Token Debug Guide

## Problem Summary

The `/auth/refresh` endpoint is failing with `InvalidCredentialsException`. We need to debug why the refresh token flow is not working.

## Architecture Overview

```
Client Request → AuthController → RefreshTokenUseCase → RefreshTokenHandler → CognitoIdentityService
                ↓
            JwtAuthGuard (extracts identityId from access token)
                ↓
            Context (contains identityId)
```

## Current Flow

1. **Client sends request to `/auth/refresh`**:
   - Header: `Authorization: Bearer <access_token>` (current access token, even if about to expire)
   - Body: `{ "refreshToken": "<refresh_token>" }` (encrypted JWE token)

2. **JwtAuthGuard validates access token**:
   - Decodes and validates the access token
   - Extracts `cognito:username` from token
   - Gets user from database
   - Sets `req.user.identityId` (which is the Cognito username)
   - Sets `req.ctx.identityId`

3. **RefreshTokenUseCase receives**:
   - `context.identityId` from the validated access token
   - `refreshToken` from the request body

4. **CognitoIdentityService.refreshToken()**:
   - Uses `identityId` (username) to generate `SECRET_HASH`
   - Sends refresh request to AWS Cognito with:
     - `REFRESH_TOKEN`: the encrypted JWE token
     - `SECRET_HASH`: computed from identityId + clientId

## Debug Steps

### Step 1: Check if identityId is being extracted

Run the server with `yarn start:dev` and make a request to `/auth/refresh`. Look for these logs:

```
[RefreshTokenUseCase] Context: { userId: '...', identityId: '...', hasRefreshToken: true }
[RefreshTokenHandler] Executing with: { hasRefreshToken: true, identityId: '...' }
[RefreshToken] Starting refresh with: { identityId: '...', refreshTokenPrefix: '...', hasClientSecret: true }
```

**If identityId is undefined**: The JwtAuthGuard is not setting it properly. Check:

- Is the access token valid?
- Is the Authorization header present?
- Is `req.user.identityId` being set in JwtAuthGuard?

### Step 2: Check the Cognito error

Look for:

```
[RefreshToken] Error: { name: '...', message: '...', code: ... }
```

Common errors:

- `NotAuthorizedException`: Token expired or SECRET_HASH mismatch
- `InvalidParameterException`: Missing required parameter

### Step 3: Verify SECRET_HASH calculation

The SECRET_HASH must be calculated as:

```
HMAC-SHA256(username + clientId, clientSecret)
```

Where `username` should be the Cognito username (identityId), NOT the email.

### Step 4: Test with scripts

#### Debug the refresh token format:

```bash
yarn ts-node scripts/debug-refresh-token.ts "<your-refresh-token>"
```

This will tell you if it's a JWE (encrypted) or JWT (plain).

#### Test the refresh flow directly:

```bash
yarn ts-node -r tsconfig-paths/register scripts/test-refresh-flow.ts "<cognito-username>" "<refresh-token>"
```

Replace:

- `<cognito-username>`: The actual Cognito username (e.g., from the database `users.identityId`)
- `<refresh-token>`: The refresh token from a login response

## Common Issues

### Issue 1: identityId is undefined

**Cause**: The endpoint is not protected with JwtAuthGuard, or the guard is not setting identityId.

**Solution**: Verify that:

1. `@UseGuards(JwtAuthGuard)` is on the endpoint
2. `req.ctx.identityId` is being set in the guard
3. The access token in the Authorization header is valid

### Issue 2: SECRET_HASH mismatch

**Cause**: The identityId used is not the correct Cognito username.

**Solution**:

1. Check what value is in `users.identityId` in the database
2. Verify it matches the Cognito username
3. Make sure we're not using email or UUID instead

### Issue 3: Refresh token expired

**Cause**: The refresh token has actually expired (usually 30 days).

**Solution**: Login again to get a fresh refresh token.

## Testing Sequence

1. **Login to get tokens**:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

Save the response: `accessToken`, `refreshToken`, `idToken`

2. **Get user info to verify identityId**:

```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer <access_token>"
```

Check the user's `identityId` matches the Cognito username.

3. **Try to refresh**:

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "<refresh_token>"}'
```

4. **Check server logs** for the debug output.

## Expected Debug Output (Success)

```
[RefreshTokenUseCase] Context: {
  userId: '123e4567-e89b-12d3-a456-426614174000',
  identityId: 'john.doe@example.com',
  hasRefreshToken: true
}
[RefreshTokenHandler] Executing with: {
  hasRefreshToken: true,
  identityId: 'john.doe@example.com'
}
[RefreshToken] Starting refresh with: {
  identityId: 'john.doe@example.com',
  refreshTokenPrefix: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU...',
  hasClientSecret: true
}
[RefreshToken] Generated SECRET_HASH with identityId: john.doe@example.com
[RefreshToken] Cognito response received: { hasAuthResult: true }
[RefreshToken] Success!
```

## Next Steps

1. Run the server with debug logs
2. Make a refresh request
3. Share the debug output
4. Based on the output, we can pinpoint exactly where it's failing
