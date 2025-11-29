import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { Request } from '@/core/infrastructure/types/http/request.type';
import { RequestContextService } from '@/core/infrastructure/services/request-context.service';
import { ResponseCapture } from '@/core/infrastructure/interfaces/response-capture.interface';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private static readonly EXCLUDED_PATHS = ['/docs'];

  constructor(private readonly requestContextService: RequestContextService) {}

  public use(req: Request, res: Response, next: NextFunction): void {
    if (this.shouldSkip(req.path)) {
      return next();
    }

    const { requestId } = req.ctx;

    this.requestContextService.run(
      {
        requestId,
        method: req.method,
        path: req.path,
      },
      () => {
        this.logRequest(req);
        this.captureResponse(req, res);
        next();
      },
    );
  }

  private shouldSkip(path: string): boolean {
    return LoggerMiddleware.EXCLUDED_PATHS.some((excluded) =>
      path.startsWith(excluded),
    );
  }

  private logRequest(req: Request): void {
    const { requestId, method, path, query, cookies, body } = {
      ...req,
      ...req.ctx,
    };

    const data = this.sanitizeJson({
      requestId,
      method,
      path,
      query,
      cookies,
      body,
    });

    Logger.log(`Request ${data}`, requestId);
  }

  private captureResponse(req: Request, res: Response): void {
    const start = Date.now();
    const capture = this.interceptResponse(res);

    res.on('finish', () => {
      const duration = Date.now() - start;
      const data = this.extractResponseData(capture.chunks);

      this.logResponse(req.ctx.requestId, res, duration, data);
    });
  }

  private interceptResponse(res: Response): ResponseCapture {
    const capture: ResponseCapture = {
      write: res.write.bind(res),
      end: res.end.bind(res),
      chunks: [],
    };

    res.write = (chunk: any, ...rest: any[]): boolean => {
      if (chunk) {
        capture.chunks.push(Buffer.from(chunk));
      }
      return capture.write(chunk, ...rest);
    };

    res.end = (chunk?: any, ...rest: any[]): Response => {
      if (chunk) {
        capture.chunks.push(Buffer.from(chunk));
      }
      return capture.end(chunk, ...rest);
    };

    return capture;
  }

  private extractResponseData(chunks: Buffer[]): string {
    return Buffer.concat(chunks).toString('utf8');
  }

  private logResponse(
    requestId: string,
    res: Response,
    duration: number,
    data: string,
  ): void {
    const payload = this.sanitizeJson({
      requestId,
      status: res.statusCode,
      statusMessage: res.statusMessage,
      duration: `${duration} ms`,
      contentLength: `${res.get('Content-Length') || 0} B`,
      data,
    });

    Logger.log(`Response ${payload}`, requestId);
  }

  private sanitizeJson(obj: Record<string, unknown>): string {
    return JSON.stringify(obj).replaceAll(String.raw`\"`, '"');
  }
}
