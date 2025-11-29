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
import { CreateUserDto } from '@/modules/users/infrastructure/http/dtos/create-user.dto';
import { UpdateUserDto } from '@/modules/users/infrastructure/http/dtos/update-user.dto';
import { UserResponseDto } from '@/modules/users/infrastructure/http/dtos';
import { ListUsersUseCase } from '@/modules/users/application/use-cases/list-users.use-case';
import { GetUserByIdUseCase } from '@/modules/users/application/use-cases/get-user-by-id.use-case';
import { CreateUserUseCase } from '@/modules/users/application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from '@/modules/users/application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '@/modules/users/application/use-cases/delete-user.use-case';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt.auth.guard';
import { PermissionGuard } from '@/modules/auth/infrastructure/guards/permission.guard';
import { RequirePermissions } from '@/modules/auth/infrastructure/decorators/require-permissions.decorator';

@ApiTags('users')
@Controller({ path: '/users', version: '1' })
export class UsersController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get('/')
  @ProtectedEndpoint('List all users', {
    query: ListQueryDto,
    paginatedResponse: UserResponseDto,
  })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Users:List'])
  public async list(
    @Ctx() context: Context,
    @QueryParserDecorator() query?: QueryParser,
  ) {
    return this.listUsersUseCase.execute(
      context,
      query?.filter,
      query?.options,
    );
  }

  @Get('/:id')
  @ProtectedEndpoint('Get user by ID')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Users:Get:*'])
  public async get(@Ctx() context: Context, @Param('id') id: string) {
    return this.getUserByIdUseCase.execute(context, id);
  }

  @Post('/')
  @ProtectedEndpoint('Create a new user', { body: CreateUserDto })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Users:Create'])
  public async create(@Ctx() context: Context, @Body() body: CreateUserDto) {
    return this.createUserUseCase.execute(context, {
      email: body.email,
      password: body.password,
      username: body.username,
      roleId: body.roleId,
      scopes: body.scopes,
      profile: body.profile
        ? {
            ...body.profile,
          }
        : undefined,
    });
  }

  @Patch('/:id')
  @ProtectedEndpoint('Update a user', { body: UpdateUserDto })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Users:Update:*'])
  public async update(
    @Ctx() context: Context,
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(context, id, body);
  }

  @Delete('/:id')
  @ProtectedEndpoint('Delete a user')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Users:Delete:*'])
  public async delete(@Ctx() context: Context, @Param('id') id: string) {
    return this.deleteUserUseCase.execute(context, id);
  }
}
