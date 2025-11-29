import { AuthException } from './auth.exception';
import { AuthErrorCode } from '@/modules/auth/domain/enums/auth-error-codes.enum';
import { HttpStatus } from '@nestjs/common';

export class UserAlreadyConfirmedException extends AuthException {
  constructor(message?: string, context?: Record<string, any>) {
    super(
      AuthErrorCode.AUTH_USER_ALREADY_CONFIRMED_002,
      message || 'User already confirmed',
      HttpStatus.CONFLICT,
      context,
    );
  }
}
