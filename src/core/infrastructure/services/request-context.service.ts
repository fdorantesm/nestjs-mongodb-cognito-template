import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  requestId: string;
  method?: string;
  path?: string;
}

@Injectable()
export class RequestContextService {
  private readonly asyncLocalStorage: AsyncLocalStorage<RequestContext>;

  constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage<RequestContext>();
  }

  public run<T>(context: RequestContext, callback: () => T): T {
    return this.asyncLocalStorage.run(context, callback);
  }

  public getContext(): RequestContext | undefined {
    return this.asyncLocalStorage.getStore();
  }

  public getRequestId(): string | undefined {
    return this.asyncLocalStorage.getStore()?.requestId;
  }
}
