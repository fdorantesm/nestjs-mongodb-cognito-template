import {
  Global,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { configOptions } from '@/config';
import { HttpExceptionFilter } from '@/core/infrastructure/filters/exception.filter';
import { TransformInterceptor } from '@/core/infrastructure/interceptors/transform.interceptor';
import { LoggerMiddleware } from '@/core/infrastructure/middlewares/logger.middleware';
import { ContextMiddleware } from '@/core/infrastructure/middlewares/context.middleware';
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
  ],
  exports: [RequestContextService],
})
export class CoreModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware, LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
