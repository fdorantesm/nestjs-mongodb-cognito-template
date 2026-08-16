import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from '@/core/infrastructure/types/http/request.type';
import type { Context } from '@/core/domain/interfaces/context.interface';

export const Ctx = createParamDecorator(
  (_data: null, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const context: Partial<Context> = {
      timestamp: request.ctx.timestamp,
      requestId: request.ctx.requestId,
    };

    if (request?.user?.uuid) {
      context.userId = request.user.uuid;
    }

    return context;
  },
);
