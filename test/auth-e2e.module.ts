import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { UuidModule } from 'nestjs-uuid';

import { AuthModule } from '@/modules/auth/auth.module';
import { IdentityModule } from '@/modules/identity/identity.module';
import { UsersModule } from '@/modules/users/users.module';

import { RequestContextService } from '@/core/infrastructure/services/request-context.service';
import { ContextMiddleware } from '@/core/infrastructure/middlewares/context.middleware';
import { TransformInterceptor } from '@/core/infrastructure/interceptors/transform.interceptor';

/**
 * Minimal in-memory test module for the auth e2e suite.
 *
 * Avoids loading MainModule (which boots Mongoose, real JWT, real Cognito).
 * Every Mongo-bound repository is replaced with its in-memory equivalent via
 * `overrideProvider` in the spec (overrides must be applied at the testing
 * module level, since providers declared here are shadowed by the ones the
 * feature modules register under the same tokens).
 * No external services are required; everything is mocked.
 */
@Module({
  imports: [
    CqrsModule,
    UuidModule,
    ConfigModule.forRoot({ isGlobal: true }),
    IdentityModule,
    AuthModule,
    UsersModule,
  ],
  providers: [
    RequestContextService,
    ContextMiddleware,
    // Mirrors CoreModule so success responses keep the { requestId, data,
    // statusCode, type } envelope the suite asserts on.
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
  exports: [AuthModule, UsersModule, IdentityModule],
})
export class AuthE2eModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}
