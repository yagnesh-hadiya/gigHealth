import { CertificationList } from "./StoreInitialTypes";

export type CertificationModalType = {
    name: string;
}

export type CertificationModalProps = {
    isOpen: boolean;
    toggle: () => void;
    setFetchData: React.Dispatch<React.SetStateAction<boolean>>;
}

export type CertificationCardProps = {
    Id: number;
    Name: string;
    Expiry: Date | string;
    setFetchData: React.Dispatch<React.SetStateAction<boolean>>;
}

export type CertificationEditModalProps = {
    isOpen: boolean;
    toggle: () => void;
    setFetchData: React.Dispatch<React.SetStateAction<boolean>>;
    editData: CertificationList;
    readOnly: boolean;
}