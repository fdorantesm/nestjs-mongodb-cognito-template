import { Service } from '@/core/application/service.decorator';
import { PERMISSIONS_REPOSITORY_TOKEN } from '@/modules/auth/domain/interfaces/permissions.repository.interface';
import type { Permission } from '@/modules/auth/domain/interfaces/permission.interface';
import { PermissionEntity } from '@/modules/auth/domain/entities/permission.entity';
import { PermissionsRepository } from '@/modules/auth/infrastructure/database/repositories/permissions.repository';
import { BaseService } from '@/core/infrastructure/services/base.service';
import { InjectRepository } from '@/core/application/inject-repository.decorator';

@Service()
export class PermissionsService extends BaseService<
  Permission,
  PermissionEntity
> {
  constructor(
    @InjectRepository(PERMISSIONS_REPOSITORY_TOKEN)
    private readonly permissionsRepository: PermissionsRepository,
  ) {
    super(permissionsRepository);
  }

  public async findByCode(code: string): Promise<PermissionEntity | null> {
    const found = await this.permissionsRepository.findOne({ code });
    return found ?? null;
  }

  public async findByCodes(codes: string[]): Promise<PermissionEntity[]> {
    return this.permissionsRepository.find({ code: { $in: codes } } as any);
  }

  public async findManyByUuids(uuids: string[]): Promise<PermissionEntity[]> {
    if (this.permissionsRepository.findManyByUuids) {
      return this.permissionsRepository.findManyByUuids(uuids);
    }
    return [];
  }
}
