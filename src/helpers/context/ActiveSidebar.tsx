import { createContext, useState } from "react";
import {
  ActiveSidebarMenuProps,
  FacilityContextProviderProps,
} from "../../types";

export const ActiveSidebarMenuContext = createContext<ActiveSidebarMenuProps>({
  activeMenu: "",
  setActiveMenu: () => {},
});

export const ActiveSidebarMenuProvider = ({
  children,
}: FacilityContextProviderProps) => {
  const [activeMenu, setActiveMenu] = useState<string>("");

  return (
    <ActiveSidebarMenuContext.Provider value={{ activeMenu, setActiveMenu }}>
      {children}
    </ActiveSidebarMenuContext.Provider>
  );
};
