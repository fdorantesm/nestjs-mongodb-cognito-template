import { BaseException } from './base.exception';
import { CoreErrorCode } from '@/core/domain/enums/error-codes.enum';
import { HttpStatus } from '@nestjs/common';

export class InvalidValueException extends BaseException {
  constructor(message: string, context?: Record<string, any>) {
    super({
      code: CoreErrorCode.CORE_VALUE_INVALID_001,
      message,
      httpStatus: HttpStatus.BAD_REQUEST,
      context,
    });
  }
}
