export type RecoveryPassword = (
  username: string,
  email: string,
  password: string,
) => Promise<void>;

export type ChangeEmail = (
  username: string,
  email: string,
  code: number,
) => Promise<void>;

export type ActivationAccount = (
  id: number,
  username: string,
  email: string,
  code: number,
) => Promise<void>;