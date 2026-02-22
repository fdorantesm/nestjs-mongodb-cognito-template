import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { UuidModule } from 'nestjs-uuid';

import { AuthController } from '@/modules/auth/infrastructure/http/controllers/auth.controller';
import { PermissionsController } from '@/modules/auth/infrastructure/http/controllers/permissions.controller';
import { RolePermissionsController } from '@/modules/auth/infrastructure/http/controllers/role-permissions.controller';
import { RolesController } from '@/modules/auth/infrastructure/http/controllers/roles.controller';
import { RoleModel } from '@/modules/auth/infrastructure/database/models/roles.model';
import { RolesRepository } from '@/modules/auth/infrastructure/database/repositories/roles.repository';
import { RolesService } from '@/modules/auth/infrastructure/services/roles.service';
import {
  CreatePermissionHandler,
  CreateRoleHandler,
  CreateRolePermissionHandler,
  DeletePermissionHandler,
  DeleteRoleHandler,
  DeleteRolePermissionHandler,
  UpdatePermissionHandler,
  UpdateRoleHandler,
} from '@/modules/auth/application/commands';
import {
  FindPermissionsHandler,
  FindRolePermissionsHandler,
  GetPermissionByIdHandler,
  GetRoleByCodeHandler,
  GetRoleByIdHandler,
  GetRolePermissionByIdHandler,
  GetUserPermissionsHandler,
  ListPermissionsHandler,
  ListRolePermissionsHandler,
  ListRolesHandler,
} from '@/modules/auth/application/queries';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt.auth.guard';
import { PermissionGuard } from '@/modules/auth/infrastructure/guards/permission.guard';
import { PermissionModel } from '@/modules/auth/infrastructure/database/models/permission.model';
import { RolePermissionModel } from '@/modules/auth/infrastructure/database/models/role-permission.model';
import { RolePermissionsRepository } from '@/modules/auth/infrastructure/database/repositories/role-permissions.repository';
import { PermissionsRepository } from '@/modules/auth/infrastructure/database/repositories/permissions.repository';
import { PermissionsService } from '@/modules/auth/infrastructure/services/permissions.service';
import { RolePermissionsService } from '@/modules/auth/infrastructure/services/role-permissions.service';
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from '@/modules/identity/application/use-cases/logout.use-case';
import { RefreshTokenUseCase } from '@/modules/auth/application/use-cases/refresh-token.use-case';
import { RespondChallengeUseCase } from '@/modules/auth/application/use-cases/respond-challenge.use-case';
import { MeUseCase } from '@/modules/auth/application/use-cases/me.use-case';
import { GetUserPermissionsUseCase } from '@/modules/auth/application/use-cases/get-user-permissions.use-case';
import { CreatePermissionUseCase } from '@/modules/auth/application/use-cases/create-permission.use-case';
import { CreateRolePermissionUseCase } from '@/modules/auth/application/use-cases/create-role-permission.use-case';
import { CreateRoleUseCase } from '@/modules/auth/application/use-cases/create-role.use-case';
import { DeletePermissionUseCase } from '@/modules/auth/application/use-cases/delete-permission.use-case';
import { DeleteRolePermissionUseCase } from '@/modules/auth/application/use-cases/delete-role-permission.use-case';
import { DeleteRoleUseCase } from '@/modules/auth/application/use-cases/delete-role.use-case';
import { GetPermissionByIdUseCase } from '@/modules/auth/application/use-cases/get-permission-by-id.use-case';
import { GetRoleByIdUseCase } from '@/modules/auth/application/use-cases/get-role-by-id.use-case';
import { GetRolePermissionByIdUseCase } from '@/modules/auth/application/use-cases/get-role-permission-by-id.use-case';
import { ListPermissionsUseCase } from '@/modules/auth/application/use-cases/list-permissions.use-case';
import { ListRolePermissionsUseCase } from '@/modules/auth/application/use-cases/list-role-permissions.use-case';
import { ListRolesUseCase } from '@/modules/auth/application/use-cases/list-roles.use-case';
import { UpdatePermissionUseCase } from '@/modules/auth/application/use-cases/update-permission.use-case';
import { UpdateRoleUseCase } from '@/modules/auth/application/use-cases/update-role.use-case';
import { UsersModule } from '@/modules/users/users.module';
import { IdentityModule } from '@/modules/identity/identity.module';
import { ROLES_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/roles.service.interface';
import { PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/permissions.service.interface';
import { ROLE_PERMISSIONS_SERVICE_TOKEN } from '@/modules/auth/domain/interfaces/role-permissions.service.interface';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      RolePermissionModel,
      PermissionModel,
      RoleModel,
    ]),
    UuidModule,
    UsersModule,
    IdentityModule,
  ],
  providers: [
    {
      provide: 'RolesRepository',
      useClass: RolesRepository,
    },
    {
      provide: ROLES_SERVICE_TOKEN,
      useClass: RolesService,
    },
    {
      provide: 'RolePermissionsRepository',
      useClass: RolePermissionsRepository,
    },
    {
      provide: 'PermissionsRepository',
      useClass: PermissionsRepository,
    },
    {
      provide: PERMISSIONS_SERVICE_TOKEN,
      useClass: PermissionsService,
    },
    {
      provide: ROLE_PERMISSIONS_SERVICE_TOKEN,
      useClass: RolePermissionsService,
    },
    // Command Handlers
    CreatePermissionHandler,
    CreateRoleHandler,
    CreateRolePermissionHandler,
    DeletePermissionHandler,
    DeleteRoleHandler,
    DeleteRolePermissionHandler,
    UpdatePermissionHandler,
    UpdateRoleHandler,
    // Query Handlers
    FindPermissionsHandler,
    FindRolePermissionsHandler,
    GetPermissionByIdHandler,
    GetRoleByCodeHandler,
    GetRoleByIdHandler,
    GetRolePermissionByIdHandler,
    GetUserPermissionsHandler,
    ListPermissionsHandler,
    ListRolePermissionsHandler,
    ListRolesHandler,
    // Guards
    JwtAuthGuard,
    PermissionGuard,
    // Use Cases
    CreatePermissionUseCase,
    CreateRolePermissionUseCase,
    CreateRoleUseCase,
    DeletePermissionUseCase,
    DeleteRolePermissionUseCase,
    DeleteRoleUseCase,
    GetPermissionByIdUseCase,
    GetRoleByIdUseCase,
    GetRolePermissionByIdUseCase,
    GetUserPermissionsUseCase,
    ListPermissionsUseCase,
    ListRolePermissionsUseCase,
    ListRolesUseCase,
    LoginUseCase,
    LogoutUseCase,
    MeUseCase,
    RefreshTokenUseCase,
    RespondChallengeUseCase,
    UpdatePermissionUseCase,
    UpdateRoleUseCase,
  ],
  controllers: [
    AuthController,
    PermissionsController,
    RolePermissionsController,
    RolesController,
  ],
  exports: [
    JwtAuthGuard,
    PermissionGuard,
    {
      provide: ROLE_PERMISSIONS_SERVICE_TOKEN,
      useClass: RolePermissionsService,
    },
    {
      provide: PERMISSIONS_SERVICE_TOKEN,
      useClass: PermissionsService,
    },
  ],
})
export class AuthModule {}
