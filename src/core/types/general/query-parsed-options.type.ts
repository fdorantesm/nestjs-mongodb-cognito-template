import { Json } from '@/core/types/general/json.type';

export type QueryParsedOptions = {
  limit?: number;
  offset?: number;
  sort?: Json | string;
  page?: number;
  lean?: boolean;
};
