import { EducationList } from "./StoreInitialTypes";

export type EducationModalType = {
    degree: string;
    school: string;
    location: string;
}

export type EducationModalProps = {
    isOpen: boolean;
    toggle: () => void;
    setFetchData: React.Dispatch<React.SetStateAction<boolean>>;
}

export type EditEducationModalProps = {
    isOpen: boolean;
    toggle: () => void;
    editData: EducationList;
    setFetchData: React.Dispatch<React.SetStateAction<boolean>>;
    readOnly: boolean;
}