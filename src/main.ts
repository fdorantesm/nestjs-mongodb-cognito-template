import {
  BadRequestException,
  ConsoleLogger,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import expressRateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { HttpServerConfiguration } from '@/core/infrastructure/types';
import { AntiThrottleConfiguration } from '@/core/infrastructure/types/http/throttles.type';
import { MainModule } from '@/main.module';
import { PaginatedResponseDto } from '@/core/infrastructure/http/dtos';
import { UserResponseDto } from '@/modules/users/infrastructure/http/dtos';
import {
  RoleResponseDto,
  PermissionResponseDto,
} from '@/modules/auth/infrastructure/http/dtos';

async function bootstrap() {
  const logger = new ConsoleLogger({
    json: true,
    colors: true,
    logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
    timestamp: true,
    compact: true,
  });

  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    logger,
    snapshot: true,
  });

  const configService: ConfigService = app.get(ConfigService);
  const config = configService.get<HttpServerConfiguration>('server');
  const antiThrottle =
    configService.get<AntiThrottleConfiguration>('antiThrottle');

  const { host, port } = config;

  app.set('trust proxy', 1);

  app.enableVersioning();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const fields = errors.map((error) => error.property);
        const errorMessages = errors.reduce<string[]>((acc, error) => {
          return acc.concat(Object.values(error.constraints || {}));
        }, []);

        return new BadRequestException({
          errors: errorMessages,
          message: `Validation failed for fields: ${fields.join(' ')}`,
        });
      },
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(helmet());

  app.use(
    expressRateLimit({
      windowMs: antiThrottle.interval,
      max: antiThrottle.maxRequest,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => {
        if (!req.ip) {
          console.error('Warning: request.ip is missing!');
          return req.socket.remoteAddress;
        }

        return req.ip.replace(/:\d+[^:]*$/, '');
      },
    }),
  );

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
      requestInterceptor: (req) => {
        const authHeaderKey = Object.keys(req.headers).find(
          (key) => key.toLowerCase() === 'authorization',
        );
        if (authHeaderKey) {
          const authHeader = req.headers[authHeaderKey];
          if (typeof authHeader === 'string') {
            if (authHeader.startsWith('Bearer ')) {
              return req;
            }
            if (!authHeader.startsWith('ApiKey ')) {
              req.headers[authHeaderKey] = `ApiKey ${authHeader}`;
            }
          }
        }
        return req;
      },
    },
  });

  app.listen(port || 3000, () => {
    Logger.log(`Server ready on http://${host}:${port}`, 'Application');
  });
}

bootstrap();
