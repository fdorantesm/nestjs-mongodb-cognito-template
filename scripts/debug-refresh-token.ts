import * as jwt from 'jsonwebtoken';

// Paste your actual refresh token here to debug
const refreshToken = process.argv[2];

if (!refreshToken) {
  console.log('Usage: ts-node scripts/debug-refresh-token.ts <refresh-token>');
  process.exit(1);
}

console.log('Refresh Token Analysis:');
console.log('=======================\n');

// Check if it's a JWE (encrypted) or JWT
const parts = refreshToken.split('.');
console.log(`Token has ${parts.length} parts`);

if (parts.length === 5) {
  console.log('✓ This is a JWE (JSON Web Encryption) token');
  console.log('  Cannot be decoded without the private key');
  console.log(
    '  This is why we need the username/identityId from another source\n',
  );

  try {
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
    console.log('JWE Header:', JSON.stringify(header, null, 2));
  } catch (error) {
    console.log('Could not parse JWE header');
  }
} else if (parts.length === 3) {
  console.log('✓ This is a JWT (JSON Web Token)');
  console.log('  Can be decoded\n');

  try {
    const decoded = jwt.decode(refreshToken, { complete: true });
    console.log('Decoded JWT:');
    console.log(JSON.stringify(decoded, null, 2));
  } catch (error) {
    console.log('Error decoding JWT:', error.message);
  }
} else {
  console.log('⚠ Unknown token format');
}

console.log('\n\nRecommendations:');
console.log('================');
if (parts.length === 5) {
  console.log('• The refresh token is encrypted (JWE)');
  console.log(
    '• You MUST send the access token in Authorization header for /auth/refresh',
  );
  console.log(
    '• The access token contains the username that we extract via JwtAuthGuard',
  );
  console.log('• Then we can generate the SECRET_HASH with that username');
}
