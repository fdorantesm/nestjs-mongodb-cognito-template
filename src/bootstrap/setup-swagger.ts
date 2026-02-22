import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { PaginatedResponseDto } from '@/core/infrastructure/http/dtos';
import {
  PermissionResponseDto,
  RoleResponseDto,
} from '@/modules/auth/infrastructure/http/dtos';
import { UserResponseDto } from '@/modules/users/infrastructure/http/dtos';

type SwaggerRequest = {
  headers: Record<string, unknown>;
};

export function setupSwagger(app: NestExpressApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('API Reference')
    .addBearerAuth()
    .addApiKey({
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      bearerFormat: 'ApiKey',
    })
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder, {
    extraModels: [
      PaginatedResponseDto,
      UserResponseDto,
      RoleResponseDto,
      PermissionResponseDto,
    ],
  });

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      requestInterceptor: (req: SwaggerRequest): SwaggerRequest => {
        const authHeaderKey = Object.keys(req.headers).find(
          (key) => key.toLowerCase() === 'authorization',
        );

        if (!authHeaderKey) {
          return req;
        }

        const authHeader = req.headers[authHeaderKey];
        if (typeof authHeader !== 'string') {
          return req;
        }

        if (authHeader.startsWith('Bearer ')) {
          return req;
        }

        if (!authHeader.startsWith('ApiKey ')) {
          req.headers[authHeaderKey] = `ApiKey ${authHeader}`;
        }

        return req;
      },
    },
  });
}
