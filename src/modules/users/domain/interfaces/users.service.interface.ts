import type { Crud } from '@/core/domain/crud.interface';
import type { User } from '@/modules/users/domain/interfaces/user.interface';
import type { UserEntity } from '@/modules/users/domain/entities/user.entity';

export const USERS_SERVICE_TOKEN = 'UsersService';
export const USERS_REPOSITORY_TOKEN = 'UsersRepository';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UsersService extends Crud<User, UserEntity> {}
