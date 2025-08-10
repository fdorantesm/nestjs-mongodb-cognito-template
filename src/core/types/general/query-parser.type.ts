import { Json } from '@/core/domain/json';
import { QueryParsedOptions } from './query-parsed-options.type';

export type QueryParser = {
  filter: Json;
  options: QueryParsedOptions;
};
