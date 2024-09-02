import { createContext, useState } from "react";
import {
  FacilityContextProviderProps,
  FacilityNameContextProps,
} from "../../types";

const FacilityNameContext = createContext<FacilityNameContextProps>({
  facilityName: "",
  setFacilityName: () => {},
});

const FacilityNameContextProvider = ({
  children,
}: FacilityContextProviderProps) => {
  const [facilityName, setFacilityName] = useState<string>("");
  return (
    <FacilityNameContext.Provider value={{ facilityName, setFacilityName }}>
      {children}
    </FacilityNameContext.Provider>
  );
};

export { FacilityNameContext, FacilityNameContextProvider };
