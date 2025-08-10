import { antiThrottleConfigLoader } from '@/config/infrastructure/config/loaders/anti-throttle.loader';
import { environmentConfigLoader } from '@/config/infrastructure/config/loaders/environment.loader';
import { serverConfigLoader } from '@/config/infrastructure/config/loaders/server.loader';
import { antiThrottleSchema } from '@/config/infrastructure/config/schemas/anti-throttle.schema';
import { configSchema } from '@/config/infrastructure/config/schemas/server.schema';
import { databaseSchema } from '@/database/infrastructure/config/schemas/database.schema';
import { combineSchemas } from '@/utils/combine-schemas';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';

export const configOptions: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  load: [serverConfigLoader, antiThrottleConfigLoader, environmentConfigLoader],
  validationSchema: combineSchemas([
    configSchema,
    databaseSchema,
    antiThrottleSchema,
  ]),
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
};
