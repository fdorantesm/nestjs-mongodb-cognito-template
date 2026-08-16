import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { cognitoLoader } from '@/modules/auth/infrastructure/config/cognito.loader';
import { IDENTITY_SERVICE_TOKEN } from '@/modules/identity/domain/interfaces/identity.service.interface';
import { CognitoIdentityService } from '@/modules/identity/infrastructure/services/cognito-identity.service';
import { ConfirmRegisterHandler } from '@/modules/identity/application/commands/confirm-register.handler';
import { CreateIdentityUserHandler } from '@/modules/identity/application/commands/create-identity-user.handler';
import { DeleteIdentityUserHandler } from '@/modules/identity/application/commands/delete-identity-user.handler';
import { InitiateAuthHandler } from '@/modules/identity/application/commands/initiate-auth.handler';
import { LogoutHandler } from '@/modules/identity/application/commands/logout.handler';
import { RefreshTokenHandler } from '@/modules/identity/application/commands/refresh-token.handler';
import { RegisterIdentityUserHandler } from '@/modules/identity/application/commands/register-identity-user.handler';
import { RespondChallengeHandler } from '@/modules/identity/application/commands/respond-challenge.handler';
import { UpdateIdentityUserHandler } from '@/modules/identity/application/commands/update-identity-user.handler';
import { GetIdentityUserHandler } from '@/modules/identity/application/queries/get-identity-user.handler';
import { queryHandlers as identityQueryHandlers } from '@/modules/identity/application/queries';

const identityProviders = [
  {
    provide: IDENTITY_SERVICE_TOKEN,
    useClass: CognitoIdentityService,
  },
];

const commandHandlers = [
  ConfirmRegisterHandler,
  CreateIdentityUserHandler,
  DeleteIdentityUserHandler,
  InitiateAuthHandler,
  LogoutHandler,
  RefreshTokenHandler,
  RegisterIdentityUserHandler,
  RespondChallengeHandler,
  UpdateIdentityUserHandler,
];

const queryHandlers = [GetIdentityUserHandler, ...identityQueryHandlers];

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forFeature(() => ({ cognito: cognitoLoader() })),
  ],
  providers: [...identityProviders, ...commandHandlers, ...queryHandlers],
  exports: [...identityProviders],
})
export class IdentityModule {}
