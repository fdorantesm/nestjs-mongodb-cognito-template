import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import type { Context } from '@/core/domain/interfaces/context.interface';
import { Ctx } from '@/core/infrastructure/decorators/context.decorator';
import { ProtectedEndpoint } from '@/core/infrastructure/decorators/protected-endpoint.decorator';
import { QueryParser as QueryParserDecorator } from '@/core/infrastructure/decorators/query-parser.decorator';
import type { QueryParser } from '@/core/types/general/query-parser.type';
import { ListQueryDto } from '@/core/infrastructure/http/dtos';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt.auth.guard';
import { PermissionGuard } from '@/modules/auth/infrastructure/guards/permission.guard';
import { RequirePermissions } from '@/modules/auth/infrastructure/decorators/require-permissions.decorator';
import { RoleResponseDto } from '@/modules/auth/infrastructure/http/dtos';
import { CreateRoleDto } from '@/modules/auth/infrastructure/http/dtos/create-role.dto';
import { UpdateRoleDto } from '@/modules/auth/infrastructure/http/dtos/update-role.dto';
import { CreateRoleUseCase } from '@/modules/auth/application/use-cases/create-role.use-case';
import { UpdateRoleUseCase } from '@/modules/auth/application/use-cases/update-role.use-case';
import { DeleteRoleUseCase } from '@/modules/auth/application/use-cases/delete-role.use-case';
import { ListRolesUseCase } from '@/modules/auth/application/use-cases/list-roles.use-case';
import { GetRoleByIdUseCase } from '@/modules/auth/application/use-cases/get-role-by-id.use-case';

@ApiTags('roles')
@Controller({ path: '/roles', version: '1' })
export class RolesController {
  constructor(
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly getRoleByIdUseCase: GetRoleByIdUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  @Get('/')
  @ProtectedEndpoint('List all roles', {
    query: ListQueryDto,
    paginatedResponse: RoleResponseDto,
  })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Roles:List'])
  public async list(
    @Ctx() context: Context,
    @QueryParserDecorator() query?: QueryParser,
  ) {
    return await this.listRolesUseCase.execute(
      context,
      query?.filter,
      query?.options,
    );
  }

  @Get('/:id')
  @ProtectedEndpoint('Get role by ID')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Roles:Get:*'])
  public async getById(@Ctx() context: Context, @Param('id') id: string) {
    return await this.getRoleByIdUseCase.execute(context, id);
  }

  @Post('/')
  @ProtectedEndpoint('Create a new role', { body: CreateRoleDto })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Roles:Create'])
  public async create(@Ctx() context: Context, @Body() body: CreateRoleDto) {
    return this.createRoleUseCase.execute(context, {
      name: body.name,
      code: body.code,
      permissions: body.permissions,
    });
  }

  @Patch('/:id')
  @ProtectedEndpoint('Update a role', { body: UpdateRoleDto })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Roles:Update:*'])
  public async update(
    @Ctx() context: Context,
    @Param('id') id: string,
    @Body() body: UpdateRoleDto,
  ) {
    return this.updateRoleUseCase.execute(context, id, body);
  }

  @Delete('/:id')
  @ProtectedEndpoint('Delete a role')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Roles:Delete:*'])
  public async delete(@Ctx() context: Context, @Param('id') id: string) {
    return this.deleteRoleUseCase.execute(context, id);
  }
}
