import { Filter } from '@/core/domain/interfaces/filter.interface';
import { Json } from '@/core/infrastructure/types';
import { QueryParsedOptions } from '@/core/types/general/query-parsed-options.type';
import { Pagination } from './pagination';

export interface Crud<I, E> {
  create(role: I): Promise<E>;
  find(
    filter?: Filter<I>,
    projection?: Json,
    options?: QueryParsedOptions,
  ): Promise<E[]>;
  findOne(
    filter?: Filter<I>,
    projection?: Json,
    options?: QueryParsedOptions,
  ): Promise<E>;
  findById(uuid: string): Promise<E>;
  trash?(
    filter?: Filter<I>,
    projection?: Json,
    options?: QueryParsedOptions,
  ): Promise<E[]>;
  all?(
    filter?: Filter<I>,
    projection?: Json,
    options?: QueryParsedOptions,
  ): Promise<E[]>;
  scan?(
    filter?: Filter<I>,
    projection?: Json,
    options?: QueryParsedOptions,
  ): Promise<E>;
  update(filter: Filter<I>, payload: Partial<I>): Promise<E>;
  delete(filter: Filter<I>): Promise<boolean>;
  findManyByUuids?(uuids: string[]): Promise<E[]>;
  createMany?(contract: I[]): Promise<E[]>;
  deleteMany?(filter: Filter<I>): Promise<boolean>;
  count?(filter?: Filter<I>, options?: QueryParsedOptions): Promise<number>;
  softDelete?(filter: Filter<I>): Promise<boolean>;
  restore?(filter: Filter<I>): Promise<E>;
  restoreMany?(filter: Filter<I>): Promise<E[]>;
  exists?(filter: Filter<I>): Promise<boolean>;
  existsMany?(filter: Filter<I>): Promise<string[]>;
  existsByUuids?(uuids: string[]): Promise<string[]>;
  paginate(
    filter: Filter<I>,
    options: QueryParsedOptions,
  ): Promise<Pagination<E>>;
}
