import { BadRequestException } from '@nestjs/common';
import type { NextFunction, Response } from 'express';

import { IpValidationMiddleware } from '@/core/infrastructure/middlewares/ip-validation.middleware';
import type { Request } from '@/core/infrastructure/types/http/request.type';

describe('IpValidationMiddleware', () => {
  let middleware: IpValidationMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    middleware = new IpValidationMiddleware();
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it('allows valid IPv4 addresses', () => {
    mockRequest.headers = {
      'x-forwarded-for': '192.168.1.1, 10.0.0.1',
    };

    expect(() =>
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      ),
    ).not.toThrow();
    expect(nextFunction).toHaveBeenCalled();
  });

  it('allows valid IPv6 addresses', () => {
    mockRequest.headers = {
      'x-forwarded-for': '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    };

    expect(() =>
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      ),
    ).not.toThrow();
    expect(nextFunction).toHaveBeenCalled();
  });

  it('rejects malformed IP values', () => {
    mockRequest.headers = {
      'x-forwarded-for': 'not-an-ip',
    };

    expect(() =>
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      ),
    ).toThrow(BadRequestException);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('rejects one invalid IP in a list', () => {
    mockRequest.headers = {
      'x-forwarded-for': '192.168.1.1, invalid-ip, 10.0.0.1',
    };

    expect(() =>
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      ),
    ).toThrow(BadRequestException);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('allows requests without IP headers', () => {
    mockRequest.headers = {};

    expect(() =>
      middleware.use(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      ),
    ).not.toThrow();
    expect(nextFunction).toHaveBeenCalled();
  });
});
