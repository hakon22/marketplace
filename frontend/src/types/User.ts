export type User = {
  id: number;
  username: string;
  email: string;
  phone: string;
  refresh_token: string;
}

export type PropsUser = {
  user: User;
}
