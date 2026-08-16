import { Module, forwardRef } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { UuidModule } from 'nestjs-uuid';

import {
  PROFILES_REPOSITORY_TOKEN,
  PROFILES_SERVICE_TOKEN,
} from '@/modules/users/domain/interfaces/profiles.service.interface';
import {
  USER_EXTRAS_REPOSITORY_TOKEN,
  USER_EXTRAS_SERVICE_TOKEN,
} from '@/modules/users/domain/interfaces/users-extra.service.interface';
import {
  USERS_REPOSITORY_TOKEN,
  USERS_SERVICE_TOKEN,
} from '@/modules/users/domain/interfaces/users.service.interface';
import { UserModel } from '@/modules/users/infrastructure/database/models/user.model';
import { ProfileModel } from '@/modules/users/infrastructure/database/models/profile.model';
import { UserExtraModel } from '@/modules/users/infrastructure/database/models/user-extra.model';
import { UsersRepository } from '@/modules/users/infrastructure/database/repositories/users.repository';
import { ProfilesRepository } from '@/modules/users/infrastructure/database/repositories/profiles.repository';
import { UserExtrasRepository } from '@/modules/users/infrastructure/database/repositories/user-extras.repository';
import { UsersService } from '@/modules/users/infrastructure/services/users.service';
import { ProfilesService } from '@/modules/users/infrastructure/services/profiles.service';
import { UserExtrasService } from '@/modules/users/infrastructure/services/users-extra.service';
import { UsersController } from '@/modules/users/infrastructure/http/controllers/users.controller';
import { CreateUserHandler } from '@/modules/users/application/commands/create-user.handler';
import { CreateUserExtraHandler } from '@/modules/users/application/commands/create-user-extra.handler';
import { ConfirmUserHandler } from '@/modules/users/application/commands/confirm-user.handler';
import { UpdateUserHandler } from '@/modules/users/application/commands/update-user.handler';
import { DeleteUserHandler } from '@/modules/users/application/commands/delete-user.handler';
import { GetUserByEmailHandler } from '@/modules/users/application/queries/get-user-by-email.handler';
import { GetUserExtraByProviderHandler } from '@/modules/users/application/queries/get-user-extra-by-provider.handler';
import { GetUserProfileByIdentityHandler } from '@/modules/users/application/queries/get-user-profile-by-identity.handler';
import { ListUsersHandler } from '@/modules/users/application/queries/list-users.handler';
import { GetUserByIdentityHandler } from '@/modules/users/application/queries/get-user-by-identity.handler';
import { GetUserByIdHandler } from '@/modules/users/application/queries/get-user-by-id.handler';
import { GetUserCountByEmailHandler } from '@/modules/users/application/queries/get-user-count-by-email.handler';
import { GetUserExtrasByUserIdHandler } from '@/modules/users/application/queries/get-user-extras-by-user-id.handler';
import { UserCreatedEventHandler } from '@/modules/users/application/events/user-created.handler';
import { IdentityModule } from '@/modules/identity/identity.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ListUsersUseCase } from '@/modules/users/application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '@/modules/users/application/use-cases/get-user-by-id.use-case';
import { CreateUserUseCase } from '@/modules/users/application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '@/modules/users/application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@/modules/users/application/use-cases/delete-user.use-case';
import { GetUserExtrasUseCase } from '@/modules/users/application/use-cases/get-user-extras.use-case';

const repositories = [
  { provide: USERS_REPOSITORY_TOKEN, useClass: UsersRepository },
  { provide: PROFILES_REPOSITORY_TOKEN, useClass: ProfilesRepository },
  {
    provide: USER_EXTRAS_REPOSITORY_TOKEN,
    useClass: UserExtrasRepository,
  },
];

const services = [
  { provide: USERS_SERVICE_TOKEN, useClass: UsersService },
  { provide: PROFILES_SERVICE_TOKEN, useClass: ProfilesService },
  { provide: USER_EXTRAS_SERVICE_TOKEN, useClass: UserExtrasService },
];

const commandHandlers = [
  CreateUserHandler,
  CreateUserExtraHandler,
  ConfirmUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];

const queryHandlers = [
  GetUserByEmailHandler,
  GetUserExtraByProviderHandler,
  GetUserExtrasByUserIdHandler,
  GetUserProfileByIdentityHandler,
  GetUserByIdentityHandler,
  GetUserCountByEmailHandler,
  ListUsersHandler,
  GetUserByIdHandler,
];

const eventHandlers = [UserCreatedEventHandler];

const useCases = [
  ListUsersUseCase,
  GetUserByIdUseCase,
  GetUserExtrasUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
];

@Module({
  imports: [
    CqrsModule,
    UuidModule,
    IdentityModule,
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([UserModel, ProfileModel, UserExtraModel]),
  ],
  controllers: [UsersController],
  providers: [
    ...repositories,
    ...services,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...useCases,
  ],
  exports: [
    ...services, // Export services for use in other modules
    ...useCases, // Export use cases for use in other modules
  ],
})
export class UsersModule {}
