import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { Request } from '@/core/infrastructure/types/http/request.type';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/docs')) {
      return next();
    }

    req.ctx = {
      timestamp: Date.now(),
      requestId: Math.random().toString(36).substring(2, 15),
      userId: req.user?.uuid,
    };

    next();
  }
}
