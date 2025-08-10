import { Request } from '@/core/infrastructure/types/http/request.type';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception?.getStatus() || 500;
    const exceptionResponse = exception.getResponse() as any;

    const timestamp = new Date().toISOString();
    const path = request.url;
    const data = exceptionResponse?.data;
    const baseData = {
      requestId: request.ctx.requestId,
      timestamp,
      path,
      data,
      cause: exception?.cause,
      errors: exceptionResponse?.errors,
    };

    Logger.error(JSON.stringify(exceptionResponse), request.ctx.requestId);

    let error = 'Oops! Something went wrong.';
    let message = 'Oops! Something went wrong.';

    const tcpStatus = StatusCodes.SERVICE_UNAVAILABLE;
    const tcpMessage = getReasonPhrase(tcpStatus);

    if (typeof exceptionResponse === 'string') {
      if (exceptionResponse.includes('ECONNREFUSED')) {
        const statusCode = StatusCodes.SERVICE_UNAVAILABLE;
        error = message = tcpMessage;
        return response.status(statusCode).send({
          ...baseData,
          statusCode,
          error,
          message,
        });
      } else {
        error = message = exceptionResponse;
        return response.status(status).send({
          ...baseData,
          statusCode: status,
          error,
          message,
        });
      }
    }

    if (typeof exceptionResponse === 'object') {
      error = exceptionResponse.error;
      message = exceptionResponse.message;
    }

    const responseBody = {
      ...baseData,
      statusCode: status,
      error,
      message,
    };

    return response.status(status).json(responseBody);
  }
}
