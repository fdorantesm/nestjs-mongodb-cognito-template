import { Context } from '@/core/domain/interfaces/context.interface';

export interface Executable {
  execute(context: Context, ...params: unknown[]): Promise<unknown>;
}
