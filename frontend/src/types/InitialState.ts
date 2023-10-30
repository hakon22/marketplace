export type LoadingStatus = 'idle' | 'loading' | 'finish' | 'failed';

export type InitialStateType = {
  loadingStatus: LoadingStatus;
  error: string | null;
  id?: number;
  token?: string;
  refresh_token?: string;
  email?: string;
  [key: string]: string | number | null | undefined;
}
