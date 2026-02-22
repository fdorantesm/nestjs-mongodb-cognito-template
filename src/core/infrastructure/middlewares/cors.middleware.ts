import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import cors = require('cors');

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  private readonly handler: ReturnType<typeof cors>;
  private readonly logger = new Logger(CorsMiddleware.name);
  private readonly allowedOrigins: string[] = [];
  private readonly allowAllOrigins: boolean = false;

  constructor(private readonly configService: ConfigService) {
    const corsSettings = this.configService.get('server.cors');
    const originsRaw = corsSettings?.origins;
    const server = this.configService.get('server');
    const host = server?.host ?? 'localhost';

    if (originsRaw === '*') {
      this.allowAllOrigins = true;
      this.allowedOrigins = [];
    } else if (Array.isArray(originsRaw)) {
      this.allowedOrigins = originsRaw
        .map((origin: string) => origin.trim())
        .filter(Boolean);
      this.allowAllOrigins = this.allowedOrigins.includes('*');
      if (host === 'localhost' && this.allowedOrigins.length === 0) {
        this.allowAllOrigins = true;
      }
    } else {
      this.allowedOrigins = [];
      this.allowAllOrigins = host === 'localhost';
    }

    this.handler = cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }

        if (this.allowAllOrigins) {
          return callback(null, true);
        }

        if (this.allowedOrigins.length === 0) {
          return callback(null, false);
        }

        if (this.allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(null, false);
      },
      methods: corsSettings?.methods,
      allowedHeaders: corsSettings?.allowedHeaders,
      credentials: corsSettings?.credentials,
      maxAge: corsSettings?.maxAge,
      exposedHeaders: ['Content-Length'],
    });
  }

  public use(req: Request, res: Response, next: NextFunction): void {
    const origin = req.headers.origin || undefined;

    if (origin) {
      if (
        !this.allowAllOrigins &&
        (this.allowedOrigins.length === 0 ||
          !this.allowedOrigins.includes(origin))
      ) {
        this.logger.error(`Origin not allowed by CORS: ${origin}`);
        res
          .status(403)
          .json({ statusCode: 403, message: 'Origin not allowed by CORS' });
        return;
      }
    }

    this.handler(req, res, next);
  }
}
