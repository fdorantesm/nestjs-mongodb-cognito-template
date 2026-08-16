import { BaseEntity } from '@/core/domain/base-entity';
import type { UserExtra } from '@/modules/users/domain/interfaces/user-extra.interface';

export class UserExtraEntity extends BaseEntity<UserExtra> {
  constructor(userExtra: UserExtra) {
    super(userExtra);
  }

  public static create(userExtra: UserExtra): UserExtraEntity {
    return new UserExtraEntity(userExtra);
  }

  public getUserId(): string {
    return this._data.userId;
  }

  public getProvider(): string {
    return this._data.provider;
  }

  public getExternalId(): string {
    return this._data.externalId;
  }

  public getExternalData() {
    return this._data.externalData;
  }

  public toObject(): UserExtra {
    return {
      ...this._data,
    };
  }

  public toJson(): UserExtra {
    return {
      ...this._data,
    };
  }
}
