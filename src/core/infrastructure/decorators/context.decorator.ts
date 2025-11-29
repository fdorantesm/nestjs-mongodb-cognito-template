import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from '@/core/infrastructure/types/http/request.type';
import type { Context } from '@/core/domain/interfaces/context.interface';

export type { Context } from '@/core/domain/interfaces/context.interface';

export const Ctx = createParamDecorator(
  (_data: null, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const context: Context = {
      timestamp: request.ctx.timestamp,
      requestId: request.ctx.requestId,
      roleName: request.ctx.roleName,
      ...(request?.user?.uuid ? { userId: request.user.uuid } : {}),
    };

    return context;
  },
);
