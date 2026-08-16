import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { Request } from '@/core/infrastructure/types/http/request.type';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction) {
    if (req.path.startsWith('/docs')) {
      return next();
    }

    const requestId = req.ctx.requestId;

    const { method, path, query, cookies, body } = req;
    const start = Date.now();
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks = [];
    let data: unknown;

    res.write = (...args: any[]): any => {
      chunks.push(Buffer.from(args[0]));
      oldWrite.apply(res, args);
    };

    res.end = (...args: any[]): any => {
      if (args[0]) {
        chunks.push(Buffer.from(args[0]));
      }
      data = Buffer.concat(chunks).toString('utf8');
      oldEnd.apply(res, args);
    };

    res.on('finish', () => {
      const duration = Date.now() - start;
      Logger.log(
        JSON.stringify({
          requestId,
          status: res.statusCode,
          statusMessage: res.statusMessage,
          duration: `${duration} ms`,
          contentLength: `${res.get('Content-Length')} B`,
          data,
        }).replace(/\\"/g, '"'),
        'Response',
      );
    });

    Logger.log(
      JSON.stringify({
        requestId,
        method,
        path,
        query,
        cookies,
        body,
      }).replace(/\\"/g, '"'),
      'Request',
    );

    next();
  }
}
