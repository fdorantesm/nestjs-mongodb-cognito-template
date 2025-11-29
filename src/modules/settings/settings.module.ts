import { UuidModule } from 'nestjs-uuid';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

import { SettingModel, SettingSchema } from './infrastructure/database/models';
import { SettingsRepository } from './infrastructure/database/repositories';
import { SettingsService } from './infrastructure/services';
import { SETTINGS_SERVICE_TOKEN } from './domain/interfaces/settings.service.interface';
import { SettingsController } from './infrastructure/http/controllers';
import {
  DeleteSettingHandler,
  UpdateSettingHandler,
  InitializeSettingHandler,
} from './application/commands';
import {
  GetSettingHandler,
  GetPublicSettingsHandler,
  GetAllSettingsHandler,
} from './application/queries';
import {
  DeleteSettingUseCase,
  GetPublicSettingsUseCase,
  GetAllSettingsUseCase,
  GetSettingUseCase,
  UpdateSettingUseCase,
} from './application/use-cases';
import { AuthModule } from '../auth/auth.module';

const CommandHandlers = [
  DeleteSettingHandler,
  UpdateSettingHandler,
  InitializeSettingHandler,
];
const QueryHandlers = [
  GetSettingHandler,
  GetPublicSettingsHandler,
  GetAllSettingsHandler,
];

@Module({
  imports: [
    CqrsModule,
    UuidModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: SettingModel.name, schema: SettingSchema },
    ]),
  ],
  controllers: [SettingsController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: 'SettingsRepository',
      useClass: SettingsRepository,
    },
    {
      provide: SETTINGS_SERVICE_TOKEN,
      useClass: SettingsService,
    },
    DeleteSettingUseCase,
    GetPublicSettingsUseCase,
    GetAllSettingsUseCase,
    GetSettingUseCase,
    UpdateSettingUseCase,
  ],
})
export class SettingsModule {}
