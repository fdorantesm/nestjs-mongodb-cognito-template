import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { isIP } from 'node:net';

import { Request } from '@/core/infrastructure/types/http/request.type';

@Injectable()
export class IpValidationMiddleware implements NestMiddleware {
  private static readonly IP_HEADERS = [
    'x-forwarded-for',
    'x-real-ip',
    'x-client-ip',
    'cf-connecting-ip',
    'true-client-ip',
  ];

  public use(req: Request, res: Response, next: NextFunction): void {
    for (const header of IpValidationMiddleware.IP_HEADERS) {
      const value = req.headers[header];

      if (!value) {
        continue;
      }

      const headerValue = Array.isArray(value) ? value[0] : value;

      if (!headerValue) {
        continue;
      }

      const ips = headerValue.split(',').map((ip) => ip.trim());

      for (const ip of ips) {
        if (ip && !isIP(ip)) {
          throw new BadRequestException(
            `Invalid IP address in ${header} header: ${ip}`,
          );
        }
      }
    }

    next();
  }
}
