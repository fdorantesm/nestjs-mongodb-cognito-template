import { BaseException } from './base.exception';
import { CoreErrorCode } from '@/core/domain/enums/error-codes.enum';
import { HttpStatus } from '@nestjs/common';

export class InvalidUuid extends BaseException {
  constructor(value: string, context?: Record<string, any>) {
    super({
      code: CoreErrorCode.CORE_UUID_INVALID_001,
      message: `Invalid UUID: ${value}`,
      httpStatus: HttpStatus.BAD_REQUEST,
      context: { ...context, invalidValue: value },
    });
  }
}
