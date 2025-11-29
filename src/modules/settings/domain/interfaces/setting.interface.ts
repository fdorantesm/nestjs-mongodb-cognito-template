import { BaseProps } from '@/core/domain/interfaces/base-props.interface';
import { SettingKey, SettingType } from '../enums';

export interface Setting extends BaseProps {
  key: SettingKey;
  value: string;
  type: SettingType;
  description?: string;
  isPublic: boolean; // Si puede ser accedido sin autenticación
  updatedBy?: string;
}

export interface SettingProps {
  key: SettingKey;
  value: string;
  type: SettingType;
  description?: string;
  isPublic: boolean;
  updatedBy?: string;
}
