import { ConsoleLogger, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { setupSecurity } from '@/bootstrap/setup-security';
import { setupSwagger } from '@/bootstrap/setup-swagger';
import { setupValidation } from '@/bootstrap/setup-validation';
import { HttpServerConfiguration } from '@/core/infrastructure/types';
import { MainModule } from '@/main.module';

async function bootstrap() {
  const logger = new ConsoleLogger({
    json: true,
    colors: true,
    logLevels: ['log', 'error', 'warn', 'debug', 'verbose'],
    timestamp: true,
    compact: true,
  });

  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    logger,
    snapshot: true,
  });

  const configService: ConfigService = app.get(ConfigService);
  const config = configService.get<HttpServerConfiguration>('server');

  const { host, port } = config;

  setupSecurity(app);

  app.enableVersioning();

  setupValidation(app);

  setupSwagger(app);

  app.listen(port || 3000, () => {
    Logger.log(`Server ready on http://${host}:${port}`, 'Application');
  });
}

bootstrap();
