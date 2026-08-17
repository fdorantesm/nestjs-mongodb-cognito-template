/**
 * E2E test bootstrap.
 *
 * Loads environment variables in order, all without touching the project root:
 *   1. `.env.testing`     (project-level test overrides, optional)
 *   2. `.env.test`        (legacy fallback)
 *   3. `.env`             (developer defaults)
 *   4. In-memory defaults below (always applied last, never overridden)
 *
 * Because step 4 always ensures PORT, DB_HOST, JWT_SECRET and other required
 * variables exist, the e2e suite never depends on a developer's local .env.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../');

dotenv.config({ path: path.join(ROOT, '.env.testing'), override: false });
dotenv.config({ path: path.join(ROOT, '.env.test'), override: false });
dotenv.config({ path: path.join(ROOT, '.env'), override: false });

const DEFAULTS: Record<string, string> = {
  NODE_ENV: 'test',
  DEBUG: 'false',
  HOST: 'localhost',
  PORT: '3001',
  DB_HOST: 'localhost',
  DB_PORT: '27017',
  DB_USERNAME: 'root',
  DB_PASSWORD: 'secret',
  DB_DATABASE: 'nestjs_test',
  JWT_SECRET: 'test-jwt-secret-do-not-use-in-prod',
  JWT_EXPIRES: '365d',
  APP_ENCRYPTION_KEY: 'e1b7a9d0448477a2d4e8c3f20b9f653c',
  COGNITO_REGION: 'us-east-1',
  COGNITO_USER_POOL_ID: 'us-east-1_TESTPOOLID',
  COGNITO_CLIENT_ID: 'test-client-id',
  COGNITO_CLIENT_SECRET: 'test-client-secret',
  APP_NAME: 'apadriname-test',
};

for (const [key, value] of Object.entries(DEFAULTS)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}
