import { Injectable } from '@nestjs/common';
import { BaseService } from '@/core/infrastructure/services/base.service';
import type { Profile } from '@/modules/auth/domain/interfaces/profile.interface';
import { ProfileEntity } from '@/modules/auth/domain/entities/profile.entity';
import { ProfilesRepository } from '@/modules/auth/infrastructure/database/repositories/profiles.repository';
import { InjectRepository } from '@/core/application/inject-repository.decorator';

@Injectable()
export class ProfilesService extends BaseService<Profile, ProfileEntity> {
  constructor(
    @InjectRepository('ProfilesRepository')
    private readonly profilesRepository: ProfilesRepository,
  ) {
    super(profilesRepository);
  }
}
