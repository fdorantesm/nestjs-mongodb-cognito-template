/* eslint-disable @typescript-eslint/no-require-imports */
import type DataStore = require('nedb-promises');
import { Crud } from '@/core/domain/crud.interface';
import { Entity } from '@/core/domain/entity';
import { Pagination } from '@/core/domain/pagination';
import { BaseRepositoryOptions } from '@/core/infrastructure/repositories/base.repository.options';
import { QueryParsedOptions } from '@/core/types/general/query-parsed-options.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseMemoryRepository<I, E extends Entity<I>>
  implements Crud<I, E>
{
  constructor(
    protected readonly store: DataStore<I>,
    private readonly entityClass: new (data: I) => E,
    private options?: BaseRepositoryOptions,
  ) {
    if (!options || options.softDelete === false) {
      this.options = {
        softDelete: undefined,
      };
    } else if (options.softDelete === true) {
      this.options = {
        softDelete: false,
      };
    }
  }

  public async create(contract: I): Promise<E> {
    const document = await this.store.insert({
      ...contract,
      isDeleted: this.options?.softDelete,
    });
    if (document) {
      return this.mapToEntity(document);
    }
  }

  public async find(
    filter?: Partial<I>,
    projection?: any,
    options?: QueryParsedOptions,
  ): Promise<E[]> {
    const q = { ...filter } as any;

    if (this.options?.softDelete !== undefined) {
      q.isDeleted = this.options.softDelete;
    }

    const query = this.store.find(q, projection);

    if (options?.sort) {
      query.sort(options.sort);
    }

    if (options?.limit) {
      query.limit(options.limit);
    }

    if (options?.offset) {
      query.skip(options.offset);
    }

    const documents = await query.exec();
    return documents.map((document) => this.mapToEntity(document));
  }

  public async findOne(filter?: Partial<I>, projection?: any): Promise<E> {
    const q = { ...filter } as any;

    if (this.options?.softDelete !== undefined) {
      q.isDeleted = this.options.softDelete;
    }

    const doc = await this.store.findOne(q, projection);

    if (doc) {
      return this.mapToEntity(doc);
    }

    return undefined;
  }

  public async findById(uuid: string, projection?: any): Promise<E> {
    const document = await this.store.findOne(
      { uuid, isDeleted: false },
      projection,
    );
    if (document) {
      return this.mapToEntity(document);
    }

    return undefined;
  }

  public async trash(
    filter?: Partial<I>,
    projection?: any,
    options?: QueryParsedOptions,
  ): Promise<E[]> {
    const q = { ...filter } as any;

    if (this.options?.softDelete !== undefined) {
      q.isDeleted = this.options.softDelete;
    }

    const query = this.store.find(q, projection);

    if (options.sort) {
      q.sort(options.sort);
    }

    if (options.limit) {
      q.limit(options.limit);
    }

    if (options.offset) {
      q.skip(options.offset);
    }

    const documents = await query;
    return documents.map((document) => this.mapToEntity(document));
  }

  public async all(
    filter?: Partial<I>,
    projection?: any,
    options?: QueryParsedOptions,
  ): Promise<E[]> {
    const query = this.store.find(filter, projection);

    if (options.sort) {
      query.sort(options.sort);
    }

    if (options.limit) {
      query.limit(options.limit);
    }

    if (options.offset) {
      query.skip(options.offset);
    }

    const documents = await query;
    return documents.map((document) => this.mapToEntity(document));
  }

  public async scan(
    filter?: Partial<I>,
    projection?: any,
    options?: QueryParsedOptions,
  ): Promise<E> {
    const query = this.store.find(filter, projection);

    if (options.sort) {
      query.sort(options.sort);
    }

    if (options.limit) {
      query.limit(options.limit);
    }

    if (options.offset) {
      query.skip(options.offset);
    }

    const document = await query;
    return this.mapToEntity(document as I);
  }

  public async update(filter: Partial<I>, payload: Partial<I>): Promise<E> {
    const data = await this.findOne(filter);
    const document = await this.store.update(
      filter,
      { ...data._toObject(), ...payload },
      {
        returnUpdatedDocs: true,
        multi: false,
      },
    );
    return this.mapToEntity(document as I);
  }

  public async delete(filter: Partial<I>): Promise<boolean> {
    const document = await this.store.remove(filter, { multi: false });
    return !!document;
  }

  public async findManyByUuids(uuids: string[]): Promise<E[]> {
    const documents = await this.store.find({
      uuid: { $in: uuids },
      isDeleted: false,
    });
    return documents.map((document) => this.mapToEntity(document));
  }

  public async createMany(contract: I[]): Promise<E[]> {
    const rows = contract.map((item) => ({
      ...item,
      isDeleted: this.options?.softDelete,
    }));
    const documents = await this.store.insertMany(rows);
    return documents.map((document) => this.mapToEntity(document));
  }

  public async deleteMany(filter: Partial<I>): Promise<boolean> {
    const document = await this.store.remove(filter, { multi: true });
    return !!document;
  }

  public count(filter?: Partial<I>): Promise<number> {
    return this.store.count(filter);
  }

  public async softDelete(filter: Partial<I>): Promise<boolean> {
    const document = await this.store.update(filter, { isDeleted: true });
    return !!document;
  }

  public async restore(filter: Partial<I>): Promise<E> {
    const document = await this.store.updateOne(filter, { isDeleted: false });
    return this.mapToEntity(document as I);
  }

  public async restoreMany(filter: Partial<I>): Promise<E[]> {
    const documents = await this.store.updateMany(
      filter,
      { isDeleted: false },
      { returnUpdatedDocs: true, multi: true },
    );
    return documents.map((document) => this.mapToEntity(document));
  }

  public async exists(filter: Partial<I>): Promise<boolean> {
    const count = await this.store.count(filter);
    return count > 0;
  }

  public async existsMany(filter: Partial<I>): Promise<string[]> {
    const rows = await this.store.find(filter as I, { uuid: 1 }).exec();

    if (rows.length > 0) {
      return rows.map((row) => row.uuid as string);
    }

    return undefined;
  }

  public async existsByUuids(uuids: string[]): Promise<string[]> {
    const rows = await this.store
      .find(
        {
          uuid: { $in: uuids },
        } as I,
        { uuid: 1 },
      )
      .exec();

    if (rows.length > 0) {
      return rows.map((row) => row.uuid as string);
    }

    return undefined;
  }

  public async paginate(
    filter: Partial<I>,
    options: QueryParsedOptions,
  ): Promise<Pagination<E>> {
    const total = await this.store.count(filter as I);
    const docs = await this.store
      .find(filter as I)
      .skip(options.offset)
      .limit(options.limit)
      .sort(options.sort)
      .exec()
      .then((documents) =>
        documents.map((document) => this.mapToEntity(document)),
      );

    const pages = Math.ceil(total / options.limit);
    const page = Math.ceil(options.offset / options.limit) + 1;
    const limit = options.limit;

    return {
      limit,
      docs,
      total,
      pages,
      page,
      offset: options.offset,
      nextPage: page < pages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      hasMore: page < pages,
    };
  }

  private mapToEntity(data: any): E {
    return new this.entityClass(data);
  }
}
