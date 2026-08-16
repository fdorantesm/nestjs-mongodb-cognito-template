import { BaseException } from '@/core/domain/exceptions/base.exception';
import { UserErrorCode } from '@/modules/users/domain/enums/user-error-codes.enum';
import { HttpStatus } from '@nestjs/common';

/**
 * Base exception for users module
 */
export abstract class UserException extends BaseException {
  constructor(
    code: UserErrorCode,
    message: string,
    httpStatus: HttpStatus = HttpStatus.BAD_REQUEST,
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
