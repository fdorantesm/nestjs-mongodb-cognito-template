import { AuthException } from './auth.exception';
import { AuthErrorCode } from '@/modules/auth/domain/enums/auth-error-codes.enum';
import { HttpStatus } from '@nestjs/common';

export class UserAlreadyRegisteredException extends AuthException {
  constructor(message?: string, context?: Record<string, any>) {
    super(
      AuthErrorCode.AUTH_USER_ALREADY_REGISTERED_001,
      message || 'User already registered',
      HttpStatus.CONFLICT,
      context,
    );
  }
}
