import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { Context } from '@/core/domain/interfaces/context.interface';
import { Ctx } from '@/core/infrastructure/decorators/context.decorator';
import { ProtectedEndpoint } from '@/core/infrastructure/decorators/protected-endpoint.decorator';
import { QueryParser as QueryParserDecorator } from '@/core/infrastructure/decorators/query-parser.decorator';
import type { QueryParser } from '@/core/types/general/query-parser.type';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt.auth.guard';
import { PermissionGuard } from '@/modules/auth/infrastructure/guards/permission.guard';
import { RequirePermissions } from '@/modules/auth/infrastructure/decorators/require-permissions.decorator';
import { CreateRolePermissionDto } from '@/modules/auth/infrastructure/http/dtos/create-role-permission.dto';
import { CreateRolePermissionUseCase } from '@/modules/auth/application/use-cases/create-role-permission.use-case';
import { DeleteRolePermissionUseCase } from '@/modules/auth/application/use-cases/delete-role-permission.use-case';
import { GetRolePermissionByIdUseCase } from '@/modules/auth/application/use-cases/get-role-permission-by-id.use-case';
import { ListRolePermissionsUseCase } from '@/modules/auth/application/use-cases/list-role-permissions.use-case';

@ApiTags('role-permissions')
@Controller({ path: '/role-permissions', version: '1' })
export class RolePermissionsController {
  constructor(
    private readonly listRolePermissionsUseCase: ListRolePermissionsUseCase,
    private readonly getRolePermissionByIdUseCase: GetRolePermissionByIdUseCase,
    private readonly createRolePermissionUseCase: CreateRolePermissionUseCase,
    private readonly deleteRolePermissionUseCase: DeleteRolePermissionUseCase,
  ) {}

  @Get('/')
  @ProtectedEndpoint('List all role-permissions')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['RolePermissions:List'])
  public async list(
    @Ctx() context: Context,
    @QueryParserDecorator() query?: QueryParser,
  ) {
    return this.listRolePermissionsUseCase.execute(
      context,
      query?.filter,
      query?.options,
    );
  }

  @Get('/:id')
  @ProtectedEndpoint('Get role-permission by ID')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['RolePermissions:List'])
  public async get(@Ctx() context: Context, @Param('id') id: string) {
    return this.getRolePermissionByIdUseCase.execute(context, id);
  }

  @Post('/')
  @ProtectedEndpoint('Associate permission to role', {
    body: CreateRolePermissionDto,
  })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['RolePermissions:Associate:*'])
  public async create(
    @Ctx() context: Context,
    @Body() body: CreateRolePermissionDto,
  ) {
    return this.createRolePermissionUseCase.execute(context, {
      roleId: body.roleId,
      permissionId: body.permissionId,
    });
  }

  @Delete('/:id')
  @ProtectedEndpoint('Dissociate permission from role')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['RolePermissions:Dissociate:*'])
  public async delete(@Ctx() context: Context, @Param('id') id: string) {
    return this.deleteRolePermissionUseCase.execute(context, id);
  }
}
