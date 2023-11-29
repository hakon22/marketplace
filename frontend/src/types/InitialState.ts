export type LoadingStatus = 'idle' | 'loading' | 'finish' | 'failed';

export type InitialStateType = {
  loadingStatus: LoadingStatus;
  error: string | null;
  id?: number;
  token?: string;
  refreshToken?: string;
  email?: string;
  username?: string;
  phone?: string;
  role?: string;
  [key: string]: string | number | null | undefined;
}
