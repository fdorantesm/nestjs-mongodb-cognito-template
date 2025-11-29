import { UuidService } from 'nestjs-uuid';

import { Service } from '@/core/application/service.decorator';
import { USER_EXTRAS_REPOSITORY_TOKEN } from '@/modules/users/domain/interfaces/users-extra.service.interface';
import { InjectRepository } from '@/core/application/inject-repository.decorator';
import { UserExtrasRepository } from '@/modules/users/infrastructure/database/repositories/user-extras.repository';
import type { UserExtra } from '@/modules/users/domain/interfaces/user-extra.interface';

@Service()
export class UserExtrasService {
  constructor(
    @InjectRepository(USER_EXTRAS_REPOSITORY_TOKEN)
    private readonly repository: UserExtrasRepository,
    private readonly uuidService: UuidService,
  ) {}

  public async createIntegration(
    userId: string,
    provider: string,
    externalId: string,
    externalData?: Record<string, unknown>,
  ): Promise<UserExtra> {
    const existing = await this.repository.findByUserIdAndProvider(
      userId,
      provider,
    );

    if (existing) {
      const updated = await this.repository.update({ userId, provider }, {
        $set: { externalId, externalData },
      } as any);
      return updated.toJson();
    }

    const created = await this.repository.create({
      uuid: this.uuidService.generate(),
      userId,
      provider,
      externalId,
      externalData,
    });

    return created.toJson();
  }

  public async findByUserIdAndProvider(
    userId: string,
    provider: string,
  ): Promise<UserExtra | null> {
    const entity = await this.repository.findByUserIdAndProvider(
      userId,
      provider,
    );
    return entity ? entity.toJson() : null;
  }

  public async findByExternalId(externalId: string): Promise<UserExtra | null> {
    const entity = await this.repository.findByExternalId(externalId);
    return entity ? entity.toJson() : null;
  }

  public async findByUserId(userId: string): Promise<UserExtra[]> {
    const entities = await this.repository.findByUserId(userId);
    return entities.map((entity) => entity.toJson());
  }

  public async deleteByUserIdAndProvider(
    userId: string,
    provider: string,
  ): Promise<boolean> {
    return this.repository.deleteByUserIdAndProvider(userId, provider);
  }
}
