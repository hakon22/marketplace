import { createContext } from 'react';

export default createContext<{
  loggedIn: boolean,
  logIn:() => void,
  logOut: () => Promise<void>,
    }>({
      loggedIn: false,
      logIn: () => undefined,
      logOut: async () => undefined,
    });
export const MobileContext = createContext<boolean>(false);
