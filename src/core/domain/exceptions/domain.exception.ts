import { HttpStatus } from '@nestjs/common';
import { BaseException, ExceptionMetadata } from './base.exception';
import { CoreErrorCode } from '@/core/domain/enums/error-codes.enum';

/**
 * Base class for domain/business logic exceptions
 * These represent violations of business rules
 */
export class DomainException extends BaseException {
  constructor(metadata: Partial<ExceptionMetadata>) {
    super({
      code: metadata.code || CoreErrorCode.CORE_DOMAIN_BAD_REQUEST_003,
      message: metadata.message || 'Domain rule violation',
      httpStatus: metadata.httpStatus || HttpStatus.BAD_REQUEST,
      context: metadata.context,
      cause: metadata.cause,
      timestamp: metadata.timestamp,
    });
  }
}

/**
 * Entity not found exception
 */
export class NotFoundException extends BaseException {
  constructor(
    message: string,
    context?: Record<string, any>,
    code: string = CoreErrorCode.CORE_DOMAIN_NOT_FOUND_001,
  ) {
    super({
      code,
      message,
      httpStatus: HttpStatus.NOT_FOUND,
      context,
    });
  }
}

/**
 * Conflict exception (e.g., duplicate resource)
 */
export class ConflictException extends BaseException {
  constructor(
    message: string,
    context?: Record<string, any>,
    code: string = CoreErrorCode.CORE_DOMAIN_CONFLICT_002,
  ) {
    super({
      code,
      message,
      httpStatus: HttpStatus.CONFLICT,
      context,
    });
  }
}

/**
 * Bad request exception (invalid input)
 */
export class BadRequestException extends BaseException {
  constructor(
    message: string,
    context?: Record<string, any>,
    code: string = CoreErrorCode.CORE_DOMAIN_BAD_REQUEST_003,
  ) {
    super({
      code,
      message,
      httpStatus: HttpStatus.BAD_REQUEST,
      context,
    });
  }
}

/**
 * Unauthorized exception
 */
export class UnauthorizedException extends BaseException {
  constructor(
    message: string,
    context?: Record<string, any>,
    code: string = CoreErrorCode.CORE_AUTH_UNAUTHORIZED_001,
  ) {
    super({
      code,
      message,
      httpStatus: HttpStatus.UNAUTHORIZED,
      context,
    });
  }
}

/**
 * Forbidden exception (insufficient permissions)
 */
export class ForbiddenException extends BaseException {
  constructor(
    message: string,
    context?: Record<string, any>,
    code: string = CoreErrorCode.CORE_AUTH_FORBIDDEN_002,
  ) {
    super({
      code,
      message,
      httpStatus: HttpStatus.FORBIDDEN,
      context,
    });
  }
}
