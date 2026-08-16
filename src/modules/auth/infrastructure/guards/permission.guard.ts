import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Reflector } from '@nestjs/core';

import type { Request } from '@/core/infrastructure/types/http/request.type';
import { FindRolePermissionsQuery } from '@/modules/auth/domain/queries/find-role-permissions.query';
import { FindPermissionsQuery } from '@/modules/auth/domain/queries/find-permissions.query';
import { PERMISSIONS_KEY } from '@/modules/auth/infrastructure/decorators/require-permissions.decorator';
import type { RolePermissionEntity } from '@/modules/auth/domain/entities/role-permission.entity';
import type { PermissionEntity } from '@/modules/auth/domain/entities/permission.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly queryBus: QueryBus,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (!user.roleId) {
      throw new ForbiddenException('User has no role assigned');
    }

    const rolePermissions = await this.queryBus.execute<RolePermissionEntity[]>(
      new FindRolePermissionsQuery({
        roleId: user.roleId as string,
      }),
    );

    if (rolePermissions.length === 0) {
      throw new ForbiddenException('User role has no permissions assigned');
    }

    const permissionIds = rolePermissions.map((rp) => rp.getPermissionId());
    const userPermissions = await this.queryBus.execute<PermissionEntity[]>(
      new FindPermissionsQuery({
        uuid: { $in: permissionIds } as any,
      }),
    );

    const userPermissionCodes = userPermissions.map((p) => p.getCode());

    for (const requiredPermission of requiredPermissions) {
      if (
        !this.hasPermission(
          requiredPermission,
          userPermissionCodes,
          user,
          request,
        )
      ) {
        throw new ForbiddenException(
          `Missing required permission: ${requiredPermission}`,
        );
      }
    }

    return true;
  }

  /**
   * Check if user has the required permission
   * Supports AWS-style format: Service:Action[:Resource]
   *
   * Examples:
   * - Users:List (no resource, matches exactly)
   * - Users:Get:* (wildcard resource, matches any)
   * - Users:Get:Self (self resource, matches if resourceId === user.uuid)
   * - Users:Get:uuid-123 (specific resource, matches if resourceId === uuid-123)
   */
  private hasPermission(
    requiredPermission: string,
    userPermissions: string[],
    user: any,
    request: Request,
  ): boolean {
    const [service, action, resource] = requiredPermission.split(':');

    if (!resource) {
      return userPermissions.includes(requiredPermission);
    }

    if (userPermissions.includes(requiredPermission)) {
      return true;
    }

    const wildcardPermission = `${service}:${action}:*`;
    if (userPermissions.includes(wildcardPermission)) {
      return true;
    }

    if (resource === 'Self') {
      const resourceId = this.extractResourceId(request);

      if (resourceId && resourceId === user.uuid) {
        return true;
      }

      if (userPermissions.includes(wildcardPermission)) {
        return true;
      }
    }

    const resourceId = this.extractResourceId(request);
    if (resourceId && resourceId === resource) {
      return true;
    }

    return false;
  }

  private extractResourceId(request: Request): string | null {
    if (request.params?.uuid) {
      return this.toStringId(request.params.uuid);
    }

    if (request.params?.id) {
      return this.toStringId(request.params.id);
    }

    if (request.query?.uuid) {
      return request.query.uuid as string;
    }

    if (request.query?.id) {
      return request.query.id as string;
    }

    if (request.body?.uuid) {
      return request.body.uuid;
    }

    if (request.body?.id) {
      return request.body.id;
    }

    if (request.body?.userId) {
      return request.body.userId;
    }

    return null;
  }

  private toStringId(value: string | string[]): string {
    if (Array.isArray(value)) {
      return String(value[0] ?? '');
    }
    return String(value);
  }
}
