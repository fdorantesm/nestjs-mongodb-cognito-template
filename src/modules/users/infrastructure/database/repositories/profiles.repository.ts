import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { Repository } from '@/core/application/repository.decorator';
import { BaseRepository } from '@/core/infrastructure/repositories/base.repository';
import { ProfileEntity } from '@/modules/users/domain/entities/profile.entity';
import type { Profile } from '@/modules/users/domain/interfaces/profile.interface';
import { ProfileDocument } from '@/modules/users/infrastructure/database/models/profile.model';

@Repository()
export class ProfilesRepository extends BaseRepository<Profile, ProfileEntity> {
  constructor(
    @InjectModel(ProfileDocument.name)
    readonly profileModel: PaginateModel<ProfileDocument>,
  ) {
    super(profileModel, ProfileEntity);
  }
}
