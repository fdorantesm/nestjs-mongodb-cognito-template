import { AuthException } from './auth.exception';
import { AuthErrorCode } from '@/modules/auth/domain/enums/auth-error-codes.enum';
import { HttpStatus } from '@nestjs/common';

export class UserNotConfirmedException extends AuthException {
  constructor(message?: string, context?: Record<string, any>) {
    super(
      AuthErrorCode.AUTH_USER_NOT_CONFIRMED_003,
      message || 'User not confirmed',
      HttpStatus.CONFLICT,
      context,
    );
  }
}
