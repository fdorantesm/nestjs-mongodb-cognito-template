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

    // Get all permissions for the user's role
    const rolePermissions = await this.queryBus.execute<RolePermissionEntity[]>(
      new FindRolePermissionsQuery({
        roleId: user.roleId as string,
      }),
    );

    if (rolePermissions.length === 0) {
      throw new ForbiddenException('User role has no permissions assigned');
    }

    // Get the actual permission entities
    const permissionIds = rolePermissions.map((rp) => rp.getPermissionId());
    const userPermissions = await this.queryBus.execute<PermissionEntity[]>(
      new FindPermissionsQuery({
        uuid: { $in: permissionIds } as any,
      }),
    );

    const userPermissionCodes = userPermissions.map((p) => p.getCode());

    // Check each required permission
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

    // If no resource specified, exact match required
    if (!resource) {
      return userPermissions.includes(requiredPermission);
    }

    // Check for exact match first
    if (userPermissions.includes(requiredPermission)) {
      return true;
    }

    // Check for wildcard permission (Service:Action:*)
    const wildcardPermission = `${service}:${action}:*`;
    if (userPermissions.includes(wildcardPermission)) {
      return true;
    }

    // Handle "Self" resource - requires resourceId in request params or body
    if (resource === 'Self') {
      const resourceId = this.extractResourceId(request);

      // If user has Self permission and resourceId matches user's UUID, allow
      if (resourceId && resourceId === user.uuid) {
        return true;
      }

      // Also check if user has wildcard for this action
      if (userPermissions.includes(wildcardPermission)) {
        return true;
      }
    }

    // For specific resource IDs, check if request targets that specific resource
    const resourceId = this.extractResourceId(request);
    if (resourceId && resourceId === resource) {
      return true;
    }

    return false;
  }

  /**
   * Extract resource ID from request params, query, or body
   * Checks common patterns: uuid, id, userId, roleId, appointmentId, etc.
   */
  private extractResourceId(request: Request): string | null {
    // Check params first (most common for RESTful routes)
    if (request.params?.uuid) return request.params.uuid;
    if (request.params?.id) return request.params.id;

    // Check query parameters
    if (request.query?.uuid) return request.query.uuid as string;
    if (request.query?.id) return request.query.id as string;

    // Check body
    if (request.body?.uuid) return request.body.uuid;
    if (request.body?.id) return request.body.id;
    if (request.body?.userId) return request.body.userId;

    return null;
  }
}
