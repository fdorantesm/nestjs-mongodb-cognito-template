import type { Crud } from '@/core/domain/crud.interface';
import type { Profile } from '@/modules/users/domain/interfaces/profile.interface';
import type { ProfileEntity } from '@/modules/users/domain/entities/profile.entity';

export const PROFILES_SERVICE_TOKEN = 'ProfilesService';
export const PROFILES_REPOSITORY_TOKEN = 'ProfilesRepository';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ProfilesService extends Crud<Profile, ProfileEntity> {}
