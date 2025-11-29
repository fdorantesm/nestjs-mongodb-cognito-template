import { HttpStatus } from '@nestjs/common';
import { BaseException, ExceptionMetadata } from './base.exception';
import { CoreErrorCode } from '@/core/domain/enums/error-codes.enum';

/**
 * Base class for infrastructure/technical exceptions
 * These represent technical failures (database, network, external services, etc.)
 */
export class InfrastructureException extends BaseException {
  constructor(metadata: Partial<ExceptionMetadata>) {
    super({
      code: metadata.code || CoreErrorCode.CORE_INFRA_INTERNAL_ERROR_004,
      message: metadata.message || 'Infrastructure error',
      httpStatus: metadata.httpStatus || HttpStatus.INTERNAL_SERVER_ERROR,
      context: metadata.context,
      cause: metadata.cause,
      timestamp: metadata.timestamp,
    });
  }
}

/**
 * Database exception
 */
export class DatabaseException extends InfrastructureException {
  constructor(message: string, context?: Record<string, any>, cause?: Error) {
    super({
      code: CoreErrorCode.CORE_INFRA_DATABASE_001,
      message,
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      context,
      cause,
    });
  }
}

/**
 * Network exception
 */
export class NetworkException extends InfrastructureException {
  constructor(message: string, context?: Record<string, any>, cause?: Error) {
    super({
      code: CoreErrorCode.CORE_INFRA_NETWORK_002,
      message,
      httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
      context,
      cause,
    });
  }
}

/**
 * External service exception
 */
export class ExternalServiceException extends InfrastructureException {
  constructor(message: string, context?: Record<string, any>, cause?: Error) {
    super({
      code: CoreErrorCode.CORE_INFRA_EXTERNAL_SERVICE_003,
      message,
      httpStatus: HttpStatus.BAD_GATEWAY,
      context,
      cause,
    });
  }
}

/**
 * Internal server error exception
 */
export class InternalServerErrorException extends InfrastructureException {
  constructor(
    message: string = 'Internal server error',
    context?: Record<string, any>,
    cause?: Error,
  ) {
    super({
      code: CoreErrorCode.CORE_INFRA_INTERNAL_ERROR_004,
      message,
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      context,
      cause,
    });
  }
}
