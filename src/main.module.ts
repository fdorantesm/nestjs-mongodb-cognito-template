import { Module } from '@nestjs/common';

import { CoreModule } from '@/core/core.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { SettingsModule } from '@/modules/settings/settings.module';

@Module({
  imports: [CoreModule, AuthModule, SettingsModule],
})
export class MainModule {}
