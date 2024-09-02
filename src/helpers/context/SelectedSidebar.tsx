import { createContext, useState } from "react";
import {
  FacilityContextProviderProps,
  SelectedActiveMenuProps,
} from "../../types";

export const SelectedMenuContext = createContext<SelectedActiveMenuProps>({
  selectedMenu: false,
  setSelectedMenu: () => {},
});

export const SelectedMenuProvider = ({
  children,
}: FacilityContextProviderProps) => {
  const [selectedMenu, setSelectedMenu] = useState<boolean>(false);

  return (
    <SelectedMenuContext.Provider value={{ selectedMenu, setSelectedMenu }}>
      {children}
    </SelectedMenuContext.Provider>
  );
};
