export interface Pagination<T> {
  items: T[];
  total: number;
  limit: number;
  page: number | undefined;
  pages: number | undefined;
  offset: number | undefined;
  nextPage: number | null;
  prevPage: number | null;
  hasMore: boolean;
}
