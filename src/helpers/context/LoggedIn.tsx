import { createContext, useState } from "react";
import {
  FacilityContextProviderProps,
  LoggedinContextProps,
} from "../../types";

export const LoggedInContext = createContext<LoggedinContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export const LoggedInContextProvider = ({
  children,
}: FacilityContextProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <LoggedInContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoggedInContext.Provider>
  );
};
