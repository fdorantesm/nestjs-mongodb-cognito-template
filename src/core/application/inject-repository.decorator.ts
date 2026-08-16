import { Inject } from '@nestjs/common';

export function InjectRepository(repositoryToken: string) {
  return Inject(repositoryToken);
}
