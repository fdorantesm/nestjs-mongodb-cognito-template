import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { SettingKey, SettingType } from '@/modules/settings/domain/enums';

export class UpdateSettingDto {
  @IsEnum(SettingKey)
  key: SettingKey;

  @IsString()
  value: string;
}

export class InitializeSettingDto {
  @IsEnum(SettingKey)
  key: SettingKey;

  @IsString()
  value: string;

  @IsEnum(SettingType)
  type: SettingType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
