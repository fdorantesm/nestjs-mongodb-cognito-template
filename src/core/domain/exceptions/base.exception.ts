import { HttpException, HttpStatus } from '@nestjs/common';

export interface ExceptionMetadata {
  code: string;
  message: string;
  httpStatus: HttpStatus;
  context?: Record<string, any>;
  cause?: Error;
  timestamp?: string;
}

/**
 * Base exception class for all domain exceptions
 * Extends HttpException to be properly caught by NestJS exception filters
 * Provides structured error information with unique error codes
 */
export abstract class BaseException extends HttpException {
  public readonly code: string;
  public readonly context?: Record<string, any>;
  public readonly timestamp: string;
  public override cause: Error | undefined;

  constructor(metadata: ExceptionMetadata) {
    // Call HttpException constructor with response object
    super(
      {
        statusCode: metadata.httpStatus,
        code: metadata.code,
        message: metadata.message,
        context: metadata.context,
        timestamp: metadata.timestamp || new Date().toISOString(),
      },
      metadata.httpStatus,
    );

    this.name = this.constructor.name;
    this.code = metadata.code;
    this.context = metadata.context;
    this.timestamp = metadata.timestamp || new Date().toISOString();
    this.cause = metadata.cause;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Returns a JSON representation of the exception
   */
  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.getStatus(),
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }

  /**
   * Returns a user-friendly representation (without stack trace)
   */
  public toUserJSON(): Record<string, any> {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.getStatus(),
      context: this.context,
      timestamp: this.timestamp,
    };
  }
}
