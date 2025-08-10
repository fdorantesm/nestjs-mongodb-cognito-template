import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { UuidModule } from 'nestjs-uuid';

import { cognitoLoader } from '@/modules/auth/infrastructure/config/cognito.loader';
import { AuthController } from '@/modules/auth/infrastructure/http/controllers/auth.controller';
import { IdentityService } from '@/modules/auth/infrastructure/services/identity.service';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt.auth.guard';
import { PermissionModel } from '@/modules/auth/infrastructure/database/models/permission.model';
import { ProfileModel } from '@/modules/auth/infrastructure/database/models/profiles.model';
import { RoleModel } from '@/modules/auth/infrastructure/database/models/roles.model';
import { UserModel } from '@/modules/auth/infrastructure/database/models/user.model';
import { RolesRepository } from '@/modules/auth/infrastructure/database/repositories/roles.repository';
import { UsersRepository } from '@/modules/auth/infrastructure/database/repositories/users.repository';
import { ProfilesRepository } from '@/modules/auth/infrastructure/database/repositories/profiles.repository';
import { PermissionsRepository } from '@/modules/auth/infrastructure/database/repositories/permissions.repository';
import { UsersService } from '@/modules/auth/infrastructure/services/users.service';
import { ProfilesService } from '@/modules/auth/infrastructure/services/profiles.service';
import { RolesService } from '@/modules/auth/infrastructure/services/roles.service';
import { PermissionsService } from '@/modules/auth/infrastructure/services/permissions.service';
import { UserRegisteredEventHandler } from '@/modules/auth/application/events/user-registered.event-handler';
import { RegisterUseCase } from '@/modules/auth/application/use-cases/register.use-case';
import { ConfirmRegisterUseCase } from '@/modules/auth/application/use-cases/confirm-register.use-case';
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case';
import { RespondChallengeUseCase } from '@/modules/auth/application/use-cases/respond-challenge.use-case';
import { MeUseCase } from '@/modules/auth/application/use-cases/me.use-case';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      RoleModel,
      PermissionModel,
      UserModel,
      ProfileModel,
    ]),
    ConfigModule.forFeature(() => ({
      cognito: cognitoLoader(),
    })),
    UuidModule,
  ],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    ConfirmRegisterUseCase,
    RespondChallengeUseCase,
    MeUseCase,
    UserRegisteredEventHandler,

    {
      provide: 'IdentityService',
      useClass: IdentityService,
    },
    {
      provide: 'UsersRepository',
      useClass: UsersRepository,
    },
    {
      provide: 'ProfilesRepository',
      useClass: ProfilesRepository,
    },
    {
      provide: 'RolesRepository',
      useClass: RolesRepository,
    },
    {
      provide: 'PermissionsRepository',
      useClass: PermissionsRepository,
    },
    {
      provide: 'UsersService',
      useClass: UsersService,
    },
    {
      provide: 'ProfilesService',
      useClass: ProfilesService,
    },
    {
      provide: 'RolesService',
      useClass: RolesService,
    },
    {
      provide: 'PermissionsService',
      useClass: PermissionsService,
    },
    {
      provide: 'JwtAuthGuard',
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
