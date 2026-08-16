import { USERS_REPOSITORY_TOKEN } from '@/modules/users/domain/interfaces/users.service.interface';
import { BaseService } from '@/core/infrastructure/services/base.service';
import { InjectRepository } from '@/core/application/inject-repository.decorator';
import type { User } from '@/modules/users/domain/interfaces/user.interface';
import { UserEntity } from '@/modules/users/domain/entities/user.entity';
import { UsersRepository } from '@/modules/users/infrastructure/database/repositories/users.repository';
import type { UsersService as IUsersService } from '@/modules/users/domain/interfaces/users.service.interface';
import { Service } from '@/core/application/service.decorator';

@Service()
export class UsersService
  extends BaseService<User, UserEntity>
  implements IUsersService
{
  constructor(
    @InjectRepository(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepository,
  ) {
    super(usersRepository);
  }
}
