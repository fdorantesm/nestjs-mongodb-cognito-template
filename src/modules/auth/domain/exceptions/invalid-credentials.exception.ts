import { AuthException } from './auth.exception';
import { AuthErrorCode } from '@/modules/auth/domain/enums/auth-error-codes.enum';
import { HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends AuthException {
  constructor(message?: string, context?: Record<string, any>) {
    super(
      AuthErrorCode.AUTH_CREDENTIALS_INVALID_001,
      message || 'Invalid credentials',
      HttpStatus.UNAUTHORIZED,
      context,
    );
  }
}
