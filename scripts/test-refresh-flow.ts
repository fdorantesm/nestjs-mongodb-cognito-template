import { NestFactory } from '@nestjs/core';
import { MainModule } from '@/main.module';
import { CognitoIdentityService } from '@/modules/identity/infrastructure/services/cognito-identity.service';

async function testRefreshFlow() {
  console.log('Testing Refresh Token Flow');
  console.log('===========================\n');

  const app = await NestFactory.createApplicationContext(MainModule);
  const cognitoService = app.get(CognitoIdentityService);

  // Test data - replace with actual values
  const testIdentityId = process.argv[2]; // username from Cognito
  const testRefreshToken = process.argv[3]; // actual refresh token

  if (!testIdentityId || !testRefreshToken) {
    console.log(
      'Usage: ts-node -r tsconfig-paths/register scripts/test-refresh-flow.ts <identityId> <refreshToken>',
    );
    process.exit(1);
  }

  console.log('Testing with:');
  console.log(`- identityId: ${testIdentityId}`);
  console.log(`- refreshToken: ${testRefreshToken.substring(0, 50)}...`);
  console.log('');

  try {
    console.log('Calling refreshToken service...');
    const result = await cognitoService.refreshToken(
      testRefreshToken,
      testIdentityId,
    );

    console.log('✓ Success!');
    console.log('Result:', {
      accessToken: result.accessToken.substring(0, 50) + '...',
      expiresIn: result.expiresIn,
    });
  } catch (error) {
    console.log('✗ Error:', error.message);
    console.log('Error name:', error.name);
    if (error.stack) {
      console.log('\nStack trace:');
      console.log(error.stack);
    }
  } finally {
    await app.close();
  }
}

testRefreshFlow().catch(console.error);
