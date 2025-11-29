import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateSettingDto } from '@/modules/settings/infrastructure/http/dtos';
import { SettingKey } from '@/modules/settings/domain/enums';
import { Ctx } from '@/core/infrastructure/decorators/context.decorator';
import type { Context } from '@/core/domain/interfaces/context.interface';
import { Endpoint } from '@/core/infrastructure/decorators/api-endpoint.decorator';
import { ProtectedEndpoint } from '@/core/infrastructure/decorators/protected-endpoint.decorator';
import {
  DeleteSettingUseCase,
  GetPublicSettingsUseCase,
  GetAllSettingsUseCase,
  GetSettingUseCase,
  UpdateSettingUseCase,
} from '@/modules/settings/application/use-cases';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt.auth.guard';
import { PermissionGuard } from '@/modules/auth/infrastructure/guards/permission.guard';
import { RequirePermissions } from '@/modules/auth/infrastructure/decorators/require-permissions.decorator';

@ApiTags('settings')
@Controller({ path: '/settings', version: '1' })
export class SettingsController {
  constructor(
    private readonly getPublicSettingsUseCase: GetPublicSettingsUseCase,
    private readonly getAllSettingsUseCase: GetAllSettingsUseCase,
    private readonly getSettingUseCase: GetSettingUseCase,
    private readonly updateSettingUseCase: UpdateSettingUseCase,
    private readonly deleteSettingUseCase: DeleteSettingUseCase,
  ) {}

  @Get('/public')
  @Endpoint('Get public settings')
  async getPublicSettings(@Ctx() context: Context) {
    return this.getPublicSettingsUseCase.execute(context);
  }

  @Get('/')
  @ProtectedEndpoint('Get all settings')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Settings:Read'])
  async getAllSettings(@Ctx() context: Context) {
    return this.getAllSettingsUseCase.execute(context);
  }

  @Get('/:key')
  @ProtectedEndpoint('Get setting by key')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Settings:Read'])
  async getSetting(@Param('key') key: SettingKey, @Ctx() context: Context) {
    return this.getSettingUseCase.execute(context, key);
  }

  @Patch('/')
  @ProtectedEndpoint('Update a setting', { body: UpdateSettingDto })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Settings:Update'])
  async updateSetting(@Body() dto: UpdateSettingDto, @Ctx() context: Context) {
    return this.updateSettingUseCase.execute(context, {
      key: dto.key,
      value: dto.value,
    });
  }

  @Delete('/:key')
  @ProtectedEndpoint('Delete a setting')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions(['Settings:Delete'])
  public async deleteSetting(
    @Param('key') key: SettingKey,
    @Ctx() context: Context,
  ) {
    return await this.deleteSettingUseCase.execute(context, { key });
  }
}
