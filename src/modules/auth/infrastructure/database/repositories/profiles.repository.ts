import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { BaseRepository } from '@/core/infrastructure/repositories/base.repository';
import { ProfileEntity } from '@/modules/auth/domain/entities/profile.entity';
import type { Profile } from '@/modules/auth/domain/interfaces/profile.interface';
import { ProfileDocument } from '@/modules/auth/infrastructure/database/models/profiles.model';

@Injectable()
export class ProfilesRepository extends BaseRepository<Profile, ProfileEntity> {
  constructor(
    @InjectModel(ProfileDocument.name)
    readonly profileModel: PaginateModel<ProfileDocument>,
  ) {
    super(profileModel, ProfileEntity);
  }
}
