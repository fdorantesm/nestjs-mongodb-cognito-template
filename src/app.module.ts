import { Module } from '@nestjs/common';

import { CoreModule } from '@/core/core.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule],
})
export class AppModule {}
