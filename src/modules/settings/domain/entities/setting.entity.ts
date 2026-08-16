import { BaseEntity } from '@/core/domain/base-entity';
import type { SettingKey, SettingType } from '@/modules/settings/domain/enums';
import type { Setting } from '@/modules/settings/domain/interfaces';

export class SettingEntity extends BaseEntity<Setting> {
  constructor(data: Setting) {
    super(data);
  }

  public getKey(): SettingKey {
    return this._data.key;
  }

  public getValue(): string {
    return this._data.value;
  }

  public getType(): SettingType {
    return this._data.type;
  }

  public getDescription(): string | undefined {
    return this._data.description;
  }

  public getIsPublic(): boolean {
    return this._data.isPublic;
  }

  public getUpdatedBy(): string | undefined {
    return this._data.updatedBy;
  }

  // Helper methods to parse values
  public getValueAsString(): string {
    return this.getValue();
  }

  public getValueAsNumber(): number {
    return Number(this.getValue());
  }

  public getValueAsBoolean(): boolean {
    const value = this.getValue();
    return value === 'true' || value === '1';
  }

  public getValueAsJson<T>(): T {
    return JSON.parse(this.getValue()) as T;
  }

  // Update value
  public updateValue(value: string, updatedBy?: string): void {
    this._data.value = value;
    if (updatedBy) {
      this._data.updatedBy = updatedBy;
    }
  }
}
