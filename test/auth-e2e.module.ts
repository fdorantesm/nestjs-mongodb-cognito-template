import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { getConnectionToken } from '@nestjs/mongoose';
import { UuidModule } from 'nestjs-uuid';

import { AuthModule } from '@/modules/auth/auth.module';
import { IdentityModule } from '@/modules/identity/identity.module';
import { UsersModule } from '@/modules/users/users.module';

import { RequestContextService } from '@/core/infrastructure/services/request-context.service';

import { UsersMemoryRepository } from '@/modules/users/infrastructure/database/repositories/users.memory-repository';
import { ProfilesMemoryRepository } from '@/modules/users/infrastructure/database/repositories/profiles.memory-repository';
import { UserExtrasMemoryRepository } from '@/modules/users/infrastructure/database/repositories/user-extras.memory-repository';
import { RolesMemoryRepository } from '@/modules/auth/infrastructure/database/repositories/roles.memory-repository';
import { PermissionsMemoryRepository } from '@/modules/auth/infrastructure/database/repositories/permissions.memory-repository';
import { RolePermissionsMemoryRepository } from '@/modules/auth/infrastructure/database/repositories/role-permissions.memory-repository';

import { USERS_REPOSITORY_TOKEN } from '@/modules/users/domain/interfaces/users.service.interface';
import { PROFILES_REPOSITORY_TOKEN } from '@/modules/users/domain/interfaces/profiles.service.interface';
import { USER_EXTRAS_REPOSITORY_TOKEN } from '@/modules/users/domain/interfaces/users-extra.service.interface';
import { ROLES_REPOSITORY_TOKEN } from '@/modules/auth/domain/interfaces/roles.repository.interface';
import { PERMISSIONS_REPOSITORY_TOKEN } from '@/modules/auth/domain/interfaces/permissions.repository.interface';
import { ROLE_PERMISSIONS_REPOSITORY_TOKEN } from '@/modules/auth/domain/interfaces/role-permissions.repository.interface';

/**
 * Minimal in-memory test module for the auth e2e suite.
 *
 * Avoids loading MainModule (which boots Mongoose, real JWT, real Cognito)
 * and replaces every Mongo-bound repository with its in-memory equivalent.
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
    {
      provide: getConnectionToken(),
      useValue: {
        model: () => ({}),
      },
    },
    {
      provide: USERS_REPOSITORY_TOKEN,
      useClass: UsersMemoryRepository
    },
    {
      provide: PROFILES_REPOSITORY_TOKEN,
      useClass: ProfilesMemoryRepository
    },
    {
      provide: USER_EXTRAS_REPOSITORY_TOKEN,
      useClass: UserExtrasMemoryRepository,
    },
    {
      provide: ROLES_REPOSITORY_TOKEN,
      useClass: RolesMemoryRepository
    },
    {
      provide: PERMISSIONS_REPOSITORY_TOKEN,
      useClass: PermissionsMemoryRepository,
    },
    {
      provide: ROLE_PERMISSIONS_REPOSITORY_TOKEN,
      useClass: RolePermissionsMemoryRepository,
    },
  ],
  exports: [AuthModule, UsersModule, IdentityModule],
})
export class AuthE2eModule {}
