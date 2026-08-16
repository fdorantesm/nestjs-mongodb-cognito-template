import { Injectable } from '@nestjs/common';
import { BaseService } from '@/core/infrastructure/services/base.service';
import type { User } from '@/modules/auth/domain/interfaces/user.interface';
import { UserEntity } from '@/modules/auth/domain/entities/user.entity';
import { UsersRepository } from '@/modules/auth/infrastructure/database/repositories/users.repository';
import { InjectRepository } from '@/core/application/inject-repository.decorator';

@Injectable()
export class UsersService extends BaseService<User, UserEntity> {
  constructor(
    @InjectRepository('UsersRepository')
    private readonly usersService: UsersRepository,
  ) {
    super(usersService);
  }
}
