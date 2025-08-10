import { Injectable } from '@nestjs/common';

import { Crud } from '@/core/domain/crud.interface';
import { Entity } from '@/core/domain/entity';
import { BaseProps } from '@/core/domain/interfaces/base-props.interface';
import { Filter } from '@/core/domain/interfaces/filter.interface';
import { Pagination } from '@/core/domain/pagination';
import { Json } from '@/core/types/general/json.type';
import { QueryParsedOptions } from '@/core/types/general/query-parsed-options.type';

@Injectable()
export class BaseService<I extends BaseProps, E extends Entity<I>>
  implements Crud<I, E>
{
  constructor(private readonly repository: Crud<I, E>) {}

  public findOne(
    filter: Filter<I>,
    projection?: Json,
    options?: QueryParsedOptions,
  ): Promise<E> {
    return this.repository.findOne(filter, projection, options);
  }

  public find(
    filter?: Filter<I>,
    projection?: Json,
    options?: QueryParsedOptions,
  ): Promise<E[]> {
    return this.repository.find(filter, projection, options);
  }

  public create(data: I): Promise<E> {
    return this.repository.create(data);
  }

  public update(filter: Filter<I>, data: Partial<I>): Promise<E> {
    return this.repository.update(filter, data);
  }

  public delete(filter: Filter<I>): Promise<boolean> {
    return this.repository.delete(filter);
  }

  public findById(uuid: string): Promise<E> {
    return this.repository.findById(uuid);
  }

  public findManyByUuids(uuids: string[]): Promise<E[]> {
    return this.repository.findManyByUuids(uuids);
  }

  public createMany(contract: I[]): Promise<E[]> {
    return this.repository.createMany(contract);
  }

  public deleteMany(filter: Filter<I>): Promise<boolean> {
    return this.repository.deleteMany(filter);
  }

  public count(
    filter?: Filter<I>,
    options?: QueryParsedOptions,
  ): Promise<number> {
    return this.repository.count(filter, options);
  }

  public softDelete(filter: Filter<I>): Promise<boolean> {
    return this.repository.softDelete(filter);
  }

  public restore(filter: Filter<I>): Promise<E> {
    return this.repository.restore(filter);
  }

  public restoreMany(filter: Filter<I>): Promise<E[]> {
    return this.repository.restoreMany(filter);
  }

  public exists(filter: Filter<I>): Promise<boolean> {
    return this.repository.exists(filter);
  }

  public existsMany(filter: Filter<I>): Promise<string[]> {
    return this.repository.existsMany(filter);
  }

  public existsByUuids(uuids: string[]): Promise<string[]> {
    return this.repository.existsByUuids(uuids);
  }

  public paginate(
    filter: Filter<I>,
    options: QueryParsedOptions,
  ): Promise<Pagination<E>> {
    return this.repository.paginate(filter, options);
  }
}
