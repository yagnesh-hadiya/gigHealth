import { createContext, useState } from "react";
import { FacilityContextProps, FacilityContextProviderProps } from "../../types";

const FacilityContext = createContext<FacilityContextProps>({ userName: '', setUserName: () => { } });

const FacilityContextProvider = ({ children }: FacilityContextProviderProps) => {
    const [userName, setUserName] = useState<string>('');

    return (
        <FacilityContext.Provider value={{ userName, setUserName }} >
            {children}
        </FacilityContext.Provider>
    );
};

export { FacilityContextProvider, FacilityContext };