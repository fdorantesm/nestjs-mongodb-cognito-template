import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';

import type { Request } from '@/core/infrastructure/types/http/request.type';
import {
  UnauthorizedException,
  ForbiddenException,
} from '@/core/domain/exceptions';

export function RoleGuard(allowedRoles: string[]): Type<CanActivate> {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    public canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<Request>();
      const user = request.user;

      if (!user) {
        throw new UnauthorizedException('User not authenticated');
      }

      const userRole = request.user?.role;

      const hasRole = allowedRoles.includes(userRole);

      if (!hasRole) {
        throw new ForbiddenException('Insufficient role', { userRole });
      }

      return true;
    }
  }

  return mixin(RoleGuardMixin);
}
