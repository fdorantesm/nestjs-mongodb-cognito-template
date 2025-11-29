import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { Request } from '@/core/infrastructure/types/http/request.type';
import { UnauthorizedException } from '@/core/domain/exceptions';
import { GetRoleByIdQuery } from '@/modules/auth/domain/queries/get-role-by-id.query';
import { GetUserByIdentityQuery } from '@/modules/users/domain/queries/get-user-by-identity.query';
import { ValidateAccessTokenQuery } from '@/modules/identity/domain/queries/validate-access-token.query';
import { GetCognitoUserQuery } from '@/modules/identity/domain/queries/get-cognito-user.query';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly queryBus: QueryBus) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractAccessToken(
      request.headers['authorization'],
    );

    try {
      const decodedAccessToken = await this.queryBus.execute(
        new ValidateAccessTokenQuery(accessToken) as any,
      );

      this.ensureTokenUse(decodedAccessToken, 'access');

      const cognitoUsername =
        decodedAccessToken.username ?? decodedAccessToken['cognito:username'];

      if (!cognitoUsername) {
        throw new UnauthorizedException('Missing Cognito username claim');
      }

      const identityUser = await this.queryBus.execute(
        new GetCognitoUserQuery(cognitoUsername) as any,
      );

      const applicationUser = await this.queryBus.execute(
        // use any to satisfy QueryBus typings for custom query class
        new GetUserByIdentityQuery(identityUser.identityId) as any,
      );

      if (!applicationUser) {
        throw new UnauthorizedException('User not registered in the platform', {
          cognitoUsername,
        });
      }

      const userData = applicationUser.toObject();
      const role = await this.resolveRoleName(userData.roleId);

      request.user = {
        uuid: applicationUser.uuid,
        email: userData.email ?? identityUser.attributes?.email,
        role,
        roleId: userData.roleId,
        sub: decodedAccessToken.sub,
        identityId: identityUser.identityId,
        username: identityUser.username,
        identityUser,
        accessTokenPayload: decodedAccessToken,
      };

      if (request.ctx) {
        request.ctx.userId = applicationUser.uuid;
        request.ctx.identityId = identityUser.identityId;
        request.ctx.roleName = role;
      } else {
        request.ctx = {
          userId: applicationUser.uuid,
          identityId: identityUser.identityId,
          roleName: role,
          timestamp: Date.now(),
          requestId: Math.random().toString(36).substring(2, 15),
        };
      }

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      Logger.error('Error validating Cognito tokens:', error.stack);
      throw new UnauthorizedException('Invalid credentials', {
        error: error?.message,
      });
    }
  }

  private extractAccessToken(rawHeader: unknown): string {
    if (typeof rawHeader !== 'string') {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const match = /^Bearer\s+(.+)$/i.exec(rawHeader);

    if (!match?.at(1)) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    return match[1].trim();
  }

  private ensureTokenUse(decoded: any, expectedUse: 'access' | 'id'): void {
    if (decoded?.token_use && decoded.token_use !== expectedUse) {
      throw new UnauthorizedException(`Invalid ${expectedUse} token`, {
        tokenUse: decoded.token_use,
        expectedUse,
      });
    }
  }

  private async resolveRoleName(roleId?: string): Promise<string | undefined> {
    if (!roleId) {
      return undefined;
    }

    const roleName = await this.queryBus.execute<string | null>(
      // Cast to any to satisfy QueryBus typing for custom query class
      new GetRoleByIdQuery(roleId) as any,
    );

    return roleName ?? undefined;
  }
}
