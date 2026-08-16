import type { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { MainModule } from '@/main.module';

export async function createScriptAppContext(): Promise<INestApplicationContext> {
  const app = await NestFactory.createApplicationContext(MainModule, {
    logger: ['error', 'warn', 'log'],
  });

  return app;
}
