import {
  Global,
  Logger,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { configOptions } from '@/config';
import { HttpExceptionFilter } from '@/core/infrastructure/filters/exception.filter';
import { TransformInterceptor } from '@/core/infrastructure/interceptors/transform.interceptor';
import { CorsMiddleware } from '@/core/infrastructure/middlewares/cors.middleware';
import { LoggerMiddleware } from '@/core/infrastructure/middlewares/logger.middleware';
import { ContextMiddleware } from '@/core/infrastructure/middlewares/context.middleware';
import { IpValidationMiddleware } from '@/core/infrastructure/middlewares/ip-validation.middleware';
import { RateLimitMiddleware } from '@/core/infrastructure/middlewares/rate-limit.middleware';
import { RequestContextService } from '@/core/infrastructure/services/request-context.service';
import { DatabaseModule } from '@/database/database.module';

@Global()
@Module({
  imports: [CqrsModule, ConfigModule.forRoot(configOptions), DatabaseModule],
  providers: [
    RequestContextService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: LoggerMiddleware,
      useClass: LoggerMiddleware,
    },
    {
      provide: CorsMiddleware,
      useClass: CorsMiddleware,
    },
    {
      provide: IpValidationMiddleware,
      useClass: IpValidationMiddleware,
    },
    {
      provide: RateLimitMiddleware,
      useClass: RateLimitMiddleware,
    },
  ],
  exports: [RequestContextService],
})
export class CoreModule {
  constructor(private readonly configService: ConfigService) {}

  public configure(consumer: MiddlewareConsumer) {
    const logger = new Logger(CoreModule.name);
    const server = this.configService.get('server');
    const host = server?.host ?? 'localhost';
    const corsEnv = this.configService.get<string>('CORS_ORIGINS');

    if (host === 'localhost' && !corsEnv) {
      logger.log(
        'CorsMiddleware runs permissive on localhost (allow all origins)',
      );
    }

    const hasThrottleEnv = Boolean(
      process.env.ANTI_THROTTLE_MAX_REQUEST ||
        process.env.ANTI_THROTTLE_READ_MAX_REQUEST ||
        process.env.ANTI_THROTTLE_WRITE_MAX_REQUEST ||
        process.env.RATE_MAX_REQUEST,
    );

    if (host === 'localhost' && !hasThrottleEnv) {
      logger.log(
        'RateLimitMiddleware runs permissive on localhost (no rate limits)',
      );
    }

    consumer
      .apply(
        CorsMiddleware,
        IpValidationMiddleware,
        ContextMiddleware,
        LoggerMiddleware,
        RateLimitMiddleware,
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
