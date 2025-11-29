import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiQuery,
  ApiHeader,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { PaginatedResponseDto } from '@/core/infrastructure/http/dtos';

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

interface EndpointOptions {
  body?: Type<any>;
  query?: Type<any>;
  queries?: QueryParam[];
  headers?: HeaderParam[];
  response?: Type<any>;
  paginatedResponse?: Type<any>;
}

export function Endpoint(summary: string, options?: EndpointOptions) {
  const decorators = [
    ApiOperation({ summary }),
    ApiUnauthorizedResponse({
      description: 'Invalid authentication credentials',
    }),
    ApiNotFoundResponse({
      description: 'Resource not found',
    }),
    ApiTooManyRequestsResponse({
      description: 'Too many requests in a short time',
    }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  ];

  if (options?.body) {
    decorators.push(ApiBody({ type: options.body }));
  }

  if (options?.query) {
    // Swagger will automatically extract @ApiProperty decorators from the DTO
    const queryMetadata =
      Reflect.getMetadata(
        'swagger/apiModelPropertiesArray',
        options.query.prototype,
      ) || [];
    for (const propertyKey of queryMetadata) {
      const metadata = Reflect.getMetadata(
        'swagger/apiModelProperties',
        options.query.prototype,
        propertyKey,
      );
      if (metadata) {
        decorators.push(
          ApiQuery({
            name: propertyKey,
            required: metadata.required ?? false,
            type: metadata.type,
            description: metadata.description,
            example: metadata.example,
            enum: metadata.enum,
          }),
        );
      }
    }
  }

  if (options?.queries) {
    for (const query of options.queries) {
      decorators.push(
        ApiQuery({
          name: query.name,
          required: query.required ?? false,
          type: query.type ?? 'string',
          description: query.description,
        }),
      );
    }
  }

  if (options?.headers) {
    for (const header of options.headers) {
      decorators.push(
        ApiHeader({
          name: header.name,
          required: header.required ?? false,
          description: header.description,
        }),
      );
    }
  }

  if (options?.response) {
    decorators.push(
      ApiOkResponse({
        description: 'Successful response',
        type: options.response,
      }),
    );
  }

  if (options?.paginatedResponse) {
    decorators.push(
      ApiOkResponse({
        description: 'Paginated list response',
        schema: {
          allOf: [
            { $ref: getSchemaPath(PaginatedResponseDto) },
            {
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(options.paginatedResponse) },
                },
              },
            },
          ],
        },
      }),
    );
  }

  return applyDecorators(...decorators);
}
