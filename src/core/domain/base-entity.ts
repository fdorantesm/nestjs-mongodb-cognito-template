import { Entity } from '@/core/domain/entity';
import { BaseProps } from '@/core/domain/interfaces/base-props.interface';

export abstract class BaseEntity<T extends BaseProps> extends Entity<T> {
  protected _data: T;
  protected _uuid: string;
  protected _hidden_fields: string[] = ['_id', '__v', 'isDeleted'];

  protected constructor(data: T) {
    super(data);
    this._data = data;
    this._uuid = data.uuid;
  }

  public get uuid(): string {
    return this._uuid;
  }

  public toJson(): T {
    const json = { ...this._data };
    this._hidden_fields.forEach((field) => {
      delete json[field];
    });
    return json;
  }

  public toObject(): T {
    return { ...this._data };
  }
}

export type PayloadBaseProps = Pick<BaseProps, 'uuid'>;
