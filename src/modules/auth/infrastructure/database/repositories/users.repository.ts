import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { BaseRepository } from '@/core/infrastructure/repositories/base.repository';
import { UserEntity } from '@/modules/auth/domain/entities/user.entity';
import type { User } from '@/modules/auth/domain/interfaces/user.interface';
import { UserDocument } from '@/modules/auth/infrastructure/database/models/user.model';

@Injectable()
export class UsersRepository extends BaseRepository<User, UserEntity> {
  constructor(
    @InjectModel(UserDocument.name)
    readonly userModel: PaginateModel<UserDocument>,
  ) {
    super(userModel, UserEntity);
  }
}
