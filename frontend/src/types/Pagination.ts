import type { LoadingStatus } from './InitialState';

export type PaginationProps<T> = {
  data: T;
  showedData: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setShowData: React.Dispatch<React.SetStateAction<any>>;
  rowsPerPage: number;
  scrollRef: React.RefObject<HTMLElement>;
  loadingStatus: LoadingStatus;
  searchId?: number;
}
