import { createContext, useState } from "react";
import { FacilityContextProviderProps, FacilityProgramManagerContextProps } from "../../types";

const FacilityProgramManagerContext = createContext<FacilityProgramManagerContextProps>({ programManager: '', setProgramManager: () => { } });

const FacilityProgamContextProvider = ({ children }: FacilityContextProviderProps) => {
    const [programManager, setProgramManager] = useState<string>('');

    return (
        <FacilityProgramManagerContext.Provider value={{ programManager, setProgramManager }} >
            {children}
        </FacilityProgramManagerContext.Provider>
    );
};

export { FacilityProgamContextProvider, FacilityProgramManagerContext };