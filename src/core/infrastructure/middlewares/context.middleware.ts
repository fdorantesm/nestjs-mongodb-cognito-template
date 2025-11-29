import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { Request } from '@/core/infrastructure/types/http/request.type';

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  private static readonly EXCLUDED_PATHS = ['/docs'];

  public use(req: Request, res: Response, next: NextFunction): void {
    if (this.shouldSkip(req.path)) {
      return next();
    }

    req.ctx = {
      timestamp: Date.now(),
      requestId: this.generateRequestId(),
      userId: req.user?.uuid,
      identityId: req.user?.identityId,
      roleName: req.user?.role,
    };

    next();
  }

  private shouldSkip(path: string): boolean {
    return ContextMiddleware.EXCLUDED_PATHS.some((excluded) =>
      path.startsWith(excluded),
    );
  }

  private generateRequestId(): string {
    const id = Math.random().toString(36).substring(2, 15);
    return `req_${id}`;
  }
}
