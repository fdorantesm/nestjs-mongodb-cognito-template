export type Filter<T> = Partial<T> & {
  isDeleted?: boolean;
  [key: string]: any;
};
