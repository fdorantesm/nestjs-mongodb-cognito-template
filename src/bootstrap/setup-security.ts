import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

export function setupSecurity(app: NestExpressApplication): void {
  app.set('trust proxy', 1);
  app.use(helmet());
}
