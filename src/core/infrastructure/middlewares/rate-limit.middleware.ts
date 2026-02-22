import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NextFunction, Response } from 'express';
import expressRateLimit, { RateLimitRequestHandler } from 'express-rate-limit';

import type { Request } from '@/core/infrastructure/types/http/request.type';
import type { AntiThrottleConfiguration } from '@/core/infrastructure/types/http/throttles.type';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly readLimiter: RateLimitRequestHandler;
  private readonly writeLimiter: RateLimitRequestHandler;

  private readonly rateLimitHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
    options?: { windowMs?: number; statusCode?: number },
  ) => {
    const retryAfter = Math.ceil((options?.windowMs ?? 30 * 60 * 1000) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    res.status(options?.statusCode ?? 429).json({
      statusCode: options?.statusCode ?? 429,
      message: 'Too many requests, please try again later.',
    });
  };

  private permissiveMode: boolean = false;

  constructor(private readonly configService: ConfigService) {
    const throttle =
      this.configService.get<AntiThrottleConfiguration>('antiThrottle') ?? {};

    const server = this.configService.get('server');
    const host = server?.host ?? 'localhost';
    const hasThrottleEnv = Boolean(
      process.env.ANTI_THROTTLE_MAX_REQUEST ||
        process.env.ANTI_THROTTLE_READ_MAX_REQUEST ||
        process.env.ANTI_THROTTLE_WRITE_MAX_REQUEST ||
        process.env.RATE_MAX_REQUEST,
    );

    if (host === 'localhost' && !hasThrottleEnv) {
      this.permissiveMode = true;
    }

    const keyGenerator = (req: Request) => {
      if (!req.ip) {
        return req.socket.remoteAddress;
      }

      return req.ip.replace(/:\d+[^:]*$/, '');
    };

    const rateLimitOptions = {
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator,
    };

    const read = throttle.readInterval ?? throttle.interval ?? 30 * 60 * 1000;
    const write =
      throttle.writeInterval ?? throttle.interval ?? 30 * 60 * 1000;

    this.readLimiter = expressRateLimit({
      ...rateLimitOptions,
      windowMs: read,
      max: throttle.readMaxRequest ?? throttle.maxRequest ?? 45,
      skip: (req) => this.permissiveMode || this.isExcludedPath(req.path),
      handler: this.rateLimitHandler,
    });

    this.writeLimiter = expressRateLimit({
      ...rateLimitOptions,
      windowMs: write,
      max: throttle.writeMaxRequest ?? throttle.maxRequest ?? 15,
      skip: (req) => this.permissiveMode || this.isExcludedPath(req.path),
      handler: this.rateLimitHandler,
    });
  }

  public use(req: Request, res: Response, next: NextFunction): void {
    if (req.method === 'OPTIONS') {
      next();
      return;
    }

    const applyLimiter = (
      limiter: RateLimitRequestHandler,
      callback: NextFunction,
    ) => {
      limiter(req, res, callback);
    };

    if (this.isReadMethod(req.method)) {
      applyLimiter(this.readLimiter, next);
      return;
    }

    applyLimiter(this.writeLimiter, next);
  }

  private isReadMethod(method: string): boolean {
    return method === 'GET' || method === 'HEAD';
  }

  private isExcludedPath(path: string): boolean {
    return path.startsWith('/docs');
  }
}
