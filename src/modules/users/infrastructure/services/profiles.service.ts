import { Service } from '@/core/application/service.decorator';
import { PROFILES_REPOSITORY_TOKEN } from '@/modules/users/domain/interfaces/profiles.service.interface';
import { BaseService } from '@/core/infrastructure/services/base.service';
import { InjectRepository } from '@/core/application/inject-repository.decorator';
import type { Profile } from '@/modules/users/domain/interfaces/profile.interface';
import { ProfileEntity } from '@/modules/users/domain/entities/profile.entity';
import { ProfilesRepository } from '@/modules/users/infrastructure/database/repositories/profiles.repository';
import type { ProfilesService as IProfilesService } from '@/modules/users/domain/interfaces/profiles.service.interface';

@Service()
export class ProfilesService
  extends BaseService<Profile, ProfileEntity>
  implements IProfilesService
{
  constructor(
    @InjectRepository(PROFILES_REPOSITORY_TOKEN)
    private readonly profilesRepository: ProfilesRepository,
  ) {
    super(profilesRepository);
  }
}
