import { Context } from '@/core/domain/interfaces/context.interface';
import type { UserRequest } from '@/core/infrastructure/types/http/user-request.type';
import { Request as ExpressRequest } from 'express';

export type Request = ExpressRequest & { ctx: Context } & UserRequest;
