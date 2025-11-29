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
import { PermissionResponseDto } from '@/modules/auth/infrastructure/http/dtos';
import { CreatePermissionDto } from '@/modules/auth/infrastructure/http/dtos/create-permission.dto';
import { UpdatePermissionDto } from '@/modules/auth/infrastructure/http/dtos/update-permission.dto';
import { CreatePermissionUseCase } from '@/modules/auth/application/use-cases/create-permission.use-case';
import { UpdatePermissionUseCase } from '@/modules/auth/application/use-cases/update-permission.use-case';
import { DeletePermissionUseCase } from '@/modules/auth/application/use-cases/delete-permission.use-case';
import { GetPermissionByIdUseCase } from '@/modules/auth/application/use-cases/get-permission-by-id.use-case';
import { ListPermissionsUseCase } from '@/modules/auth/application/use-cases/list-permissions.use-case';

@ApiTags('permissions')
@Controller({ path: '/permissions', version: '1' })
export class PermissionsController {
  constructor(
    private readonly listPermissionsUseCase: ListPermissionsUseCase,
    private readonly getPermissionByIdUseCase: GetPermissionByIdUseCase,
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
  ) {}

  @Get('/')
  @ProtectedEndpoint('List all permissions', {
    query: ListQueryDto,
    paginatedResponse: PermissionResponseDto,
  })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Permissions:List'])
  public async list(
    @Ctx() context: Context,
    @QueryParserDecorator() query?: QueryParser,
  ) {
    return this.listPermissionsUseCase.execute(
      context,
      query?.filter,
      query?.options,
    );
  }

  @Get('/:id')
  @ProtectedEndpoint('Get permission by ID')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Permissions:Get:*'])
  public async get(@Ctx() context: Context, @Param('id') id: string) {
    return this.getPermissionByIdUseCase.execute(context, id);
  }

  @Post('/')
  @ProtectedEndpoint('Create a new permission', { body: CreatePermissionDto })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Permissions:Create'])
  public async create(
    @Ctx() context: Context,
    @Body() body: CreatePermissionDto,
  ) {
    return this.createPermissionUseCase.execute(context, {
      name: body.name,
      code: body.code,
    });
  }

  @Patch('/:id')
  @ProtectedEndpoint('Update a permission', { body: UpdatePermissionDto })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Permissions:Update:*'])
  public async update(
    @Ctx() context: Context,
    @Param('id') id: string,
    @Body() body: UpdatePermissionDto,
  ) {
    return this.updatePermissionUseCase.execute(context, id, body);
  }

  @Delete('/:id')
  @ProtectedEndpoint('Delete a permission')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Permissions:Delete:*'])
  public async delete(@Ctx() context: Context, @Param('id') id: string) {
    return this.deletePermissionUseCase.execute(context, id);
  }
}
