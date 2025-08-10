import { Injectable } from '@nestjs/common';
import { PaginateModel } from 'mongoose';

import { Crud } from '@/core/domain/crud.interface';
import { Entity } from '@/core/domain/entity';
import { Pagination } from '@/core/domain/pagination';
import { BaseRepositoryOptions } from '@/core/infrastructure/repositories/base.repository.options';
import { Json } from '@/core/types/general/json.type';
import { QueryParsedOptions } from '@/core/types/general/query-parsed-options.type';
import { toUuid } from '@/utils/mongo-uuid';
import type { Filter } from '@/core/domain/interfaces/filter.interface';

@Injectable()
export class BaseRepository<I, E extends Entity<I>> implements Crud<I, E> {
  constructor(
    private readonly model: PaginateModel<any>,
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

  private mapToEntity(data: I & any): E {
    if (data.uuid) {
      data.uuid = toUuid(data.uuid);
    }

    return new this.entityClass(data);
  }

  public async findById(uuid: string): Promise<E> {
    const row = await this.model.findOne({ uuid }).lean();
    if (row) {
      return this.mapToEntity(row as I);
    }
  }

  public async findManyByUuids?(uuids: string[]): Promise<E[]> {
    const rows = await this.model.find({ uuid: { $in: uuids } }).lean();
    return rows.map((row) => this.mapToEntity(row as I));
  }

  public async createMany?(contract: I[]): Promise<E[]> {
    const rows = await this.model.create(contract);
    return rows.map((row) => this.mapToEntity(row.toJSON() as I));
  }

  public async findOne(filter: Filter<I> & any): Promise<E> {
    if (this.options?.softDelete !== undefined) {
      filter.isDeleted = this.options.softDelete;
    }

    const row = await this.model.findOne(filter).lean();

    if (row) {
      return this.mapToEntity(row as I);
    }

    return undefined;
  }

  public async scan(
    filter: Filter<I>,
    projection?: Json,
    options?: QueryParsedOptions,
  ): Promise<E> {
    const row = await this.model
      .findOne({ ...filter } as I, projection, options)
      .lean();
    if (row) {
      return this.mapToEntity(row as I);
    }

    return undefined;
  }

  public async trash(
    filter: Filter<I>,
    projection?: Json,
    options?: QueryParsedOptions,
  ): Promise<E[]> {
    const q = { ...filter };

    if (this.options?.softDelete !== undefined) {
      q.isDeleted = this.options.softDelete;
    }

    const rows = await this.model.find(q as I, projection, options).lean();
    return rows.map((row) => this.mapToEntity(row as I));
  }

  public async all(
    filter?: Filter<I>,
    projection?: Json,
    options?: QueryParsedOptions,
  ): Promise<E[]> {
    const rows = await this.model.find(filter as I, projection, options).lean();
    return rows.map((row) => this.mapToEntity(row as I));
  }

  public async find(
    filter?: Filter<I>,
    projection?: Json,
    options?: QueryParsedOptions,
  ): Promise<E[]> {
    const q = { ...filter };

    if (this.options?.softDelete !== undefined) {
      q.isDeleted = this.options.softDelete;
    }

    const rows = await this.model.find(q as I, projection, options).lean();

    return rows.map((row) => this.mapToEntity(row as I));
  }

  public async create(data: I): Promise<E> {
    const row = await this.model.create(data);
    if (row) {
      return this.mapToEntity(row as I);
    }
  }

  public async update(filter: Filter<I>, data: I): Promise<E> {
    const updated = await this.model
      .updateOne(filter as I, data)
      .lean()
      .then(() => this.findOne(filter));

    if (updated) {
      return updated;
    }

    return undefined;
  }

  public async delete(filter: Filter<I>): Promise<boolean> {
    const deleted = await this.model.deleteOne(filter as I).exec();
    return deleted.deletedCount > 0;
  }

  public async deleteMany(filter: Filter<I>): Promise<boolean> {
    const deleted = await this.model.deleteMany(filter as I).exec();
    return deleted.deletedCount > 0;
  }

  public async count(
    filter?: Filter<I>,
    options?: QueryParsedOptions,
  ): Promise<number> {
    return this.model.countDocuments(filter as I, options).exec();
  }

  public async softDelete(filter: Filter<I>): Promise<boolean> {
    const deleted = await this.model
      .updateOne(filter as I, { deletedAt: new Date(), isDeleted: true })
      .exec();

    return deleted.modifiedCount > 0;
  }

  public async restore(filter: Filter<I>): Promise<E> {
    const deleted = await this.model
      .updateOne(filter as I, { deletedAt: undefined, isDeleted: false })
      .exec();

    if (deleted.modifiedCount > 0) {
      return this.findOne(filter);
    }

    return undefined;
  }

  public async restoreMany(filter: Filter<I>): Promise<E[]> {
    const deleted = await this.model
      .updateMany(filter as I, { deletedAt: undefined, isDeleted: false })
      .exec();

    if (deleted.modifiedCount > 0) {
      return this.find(filter);
    }

    return undefined;
  }

  public async exists(filter: Filter<I>): Promise<boolean> {
    const row = await this.model
      .findOne(filter as I)
      .select('uuid')
      .exec();
    return Boolean(row);
  }

  public async existsMany(filter: Filter<I>): Promise<string[]> {
    const rows = await this.model
      .find(filter as I)
      .select('uuid')
      .exec();

    if (rows.length > 0) {
      return rows.map((row) => row.uuid);
    }

    return undefined;
  }

  public async existsByUuids(uuids: string[]): Promise<string[]> {
    const rows = await this.model
      .find({ uuid: { $in: uuids } })
      .select('uuid')
      .exec();

    if (rows.length > 0) {
      return rows.map((row) => row.uuid);
    }

    return undefined;
  }

  public async paginate(
    filter: Filter<I>,
    options: any,
  ): Promise<Pagination<E>> {
    options.page = options.page ?? 1;
    options.limit = options.limit ?? 10;

    const result = await this.model.paginate(filter as I, options);

    return {
      docs: result.docs.map((row) =>
        this.mapToEntity(options.lean ? row : (row.toJSON() as I)),
      ),
      total: result.total,
      limit: result.limit,
      page: result.page,
      pages: result.pages,
      offset: result.offset,
      prevPage: result.page - 1 > 0 ? result.page - 1 : undefined,
      nextPage: result.page + 1 <= result.pages ? result.page + 1 : undefined,
      hasMore: result.page < result.pages,
    };
  }
}
