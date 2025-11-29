import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { Repository } from '@/core/application/repository.decorator';
import { BaseRepository } from '@/core/infrastructure/repositories/base.repository';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import type { User } from '@/modules/users/domain/interfaces/user.interface';
import { UserDocument } from '@/modules/users/infrastructure/database/models/user.model';

@Repository()
export class UsersRepository extends BaseRepository<User, UserEntity> {
  constructor(
    @InjectModel(UserDocument.name)
    readonly userModel: PaginateModel<UserDocument>,
  ) {
    super(userModel, UserEntity);
  }
}
