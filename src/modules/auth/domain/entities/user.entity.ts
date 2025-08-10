import { BaseEntity } from '@/core/domain/base-entity';
import type { User } from '@/modules/auth/domain/interfaces/user.interface';

export class UserEntity extends BaseEntity<User> {
  constructor(user: User) {
    super(user);
  }

  public static create(user: User): UserEntity {
    return new UserEntity(user);
  }

  public getIdentityId(): string {
    return this._data.identityId;
  }

  public getEmail(): string {
    return this._data.email;
  }

  public isConfirmed(): boolean {
    return this._data.isConfirmed;
  }

  public toJson(): User {
    return {
      ...super.toJson(),
      identityId: undefined,
    };
  }
}
