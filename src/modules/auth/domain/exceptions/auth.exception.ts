import { BaseException } from '@/core/domain/exceptions/base.exception';
import { AuthErrorCode } from '@/modules/auth/domain/enums/auth-error-codes.enum';
import { HttpStatus } from '@nestjs/common';

/**
 * Base exception for authentication module
 */
export abstract class AuthException extends BaseException {
  constructor(
    code: AuthErrorCode,
    message: string,
    httpStatus: HttpStatus = HttpStatus.UNAUTHORIZED,
    context?: Record<string, any>,
  ) {
    super({
      code,
      message,
      httpStatus,
      context,
    });
  }
}
