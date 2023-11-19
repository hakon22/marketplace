export type PaginationProps<T> = {
  data: T;
  setShowData: React.Dispatch<React.SetStateAction<T>>;
  rowsPerPage: number;
  scrollRef: React.RefObject<HTMLElement>;
  search?: null | T;
  filter?: undefined | string;
}
