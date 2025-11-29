import { applyDecorators, Type } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { Endpoint } from '@/core/infrastructure/decorators/api-endpoint.decorator';

interface QueryParam {
  name: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean';
  description?: string;
}

interface HeaderParam {
  name: string;
  required?: boolean;
  description?: string;
}

interface ProtectedEndpointOptions {
  body?: Type<any>;
  query?: Type<any>;
  queries?: QueryParam[];
  headers?: HeaderParam[];
  response?: Type<any>;
  paginatedResponse?: Type<any>;
}

export function ProtectedEndpoint(
  summary: string,
  options?: ProtectedEndpointOptions,
) {
  const decorators = [Endpoint(summary, options), ApiBearerAuth()];

  return applyDecorators(...decorators);
}
