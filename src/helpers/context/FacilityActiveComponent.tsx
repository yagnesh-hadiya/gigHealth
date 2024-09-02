import { createContext, useState } from "react";
import { FacilityActiveComponentProps, FacilityContextProviderProps } from "../../types";

const FacilityActiveComponentContext = createContext<FacilityActiveComponentProps>({ activeComponent: '', setActiveComponent: () => { } });

const FacilityActiveComponentContextProvider = ({ children }: FacilityContextProviderProps) => {
    const [activeComponent, setActiveComponent] = useState<string>("");

    return (
        <FacilityActiveComponentContext.Provider value={{ activeComponent, setActiveComponent }} >
            {children}
        </FacilityActiveComponentContext.Provider>
    );
};

export { FacilityActiveComponentContextProvider, FacilityActiveComponentContext };