import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { Repository } from '@/core/application/repository.decorator';
import { BaseRepository } from '@/core/infrastructure/repositories/base.repository';
import type { UserExtra } from '@/modules/users/domain/interfaces/user-extra.interface';
import { UserExtraEntity } from '@/modules/users/domain/entities/user-extra.entity';
import { UserExtraDocument } from '@/modules/users/infrastructure/database/models/user-extra.model';

@Repository()
export class UserExtrasRepository extends BaseRepository<
  UserExtra,
  UserExtraEntity
> {
  constructor(
    @InjectModel(UserExtraDocument.name)
    readonly userExtraModel: PaginateModel<UserExtraDocument>,
  ) {
    super(userExtraModel, UserExtraEntity);
  }

  public async findByUserIdAndProvider(
    userId: string,
    provider: string,
  ): Promise<UserExtraEntity | null> {
    const document = await this.userExtraModel.findOne({
      userId,
      provider,
    });

    if (!document) {
      return null;
    }

    return new UserExtraEntity(
      document.toObject({ getters: true, virtuals: true }) as UserExtra,
    );
  }

  public async findByExternalId(
    externalId: string,
  ): Promise<UserExtraEntity | null> {
    const document = await this.userExtraModel.findOne({ externalId });

    if (!document) {
      return null;
    }

    return new UserExtraEntity(
      document.toObject({ getters: true, virtuals: true }) as UserExtra,
    );
  }

  public async findByUserId(userId: string): Promise<UserExtraEntity[]> {
    const documents = await this.userExtraModel.find({ userId });

    return documents.map((doc) =>
      UserExtraEntity.create(
        doc.toObject({ getters: true, virtuals: true }) as UserExtra,
      ),
    );
  }

  public async deleteByUserIdAndProvider(
    userId: string,
    provider: string,
  ): Promise<boolean> {
    const result = await this.userExtraModel.deleteOne({
      userId,
      provider,
    });
    return result.deletedCount > 0;
  }
}
