import { BaseEntity } from '@/core/domain/base-entity';
import type { Profile } from '@/modules/users/domain/interfaces/profile.interface';

export class ProfileEntity extends BaseEntity<Profile> {
  constructor(profile: Profile) {
    super(profile);
  }

  public static create(profile: Profile): ProfileEntity {
    return new ProfileEntity(profile);
  }

  public getUserId(): string {
    return this._data.userId;
  }

  public getDisplayName(): string {
    return this._data.displayName;
  }

  public update(fields: Partial<Profile>): void {
    this._data = {
      ...this._data,
      ...fields,
    };
  }

  public toObject(): Profile {
    return {
      ...this._data,
    };
  }

  public toJson(): Profile {
    return {
      ...super.toJson(),
    };
  }
}
