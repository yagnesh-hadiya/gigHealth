
export interface FacilityRoles{
  Id: number;
  Role:string
}

export  interface ContactFormDataType {
    FirstName: string;
    LastName: string;
    Title: string;
    Phone: string;
    Email: string; 
    Fax?: string | null;
}
export type ContactListType = {
  Id: number;
  FirstName: string;
  LastName: string;
  Title: string;
  Phone: string;
  Fax: string | null;
  Email: string;
  FacilityRole: { Id?: number; Role: string } | null;
};

export interface AddNewContactsProps {
    isOpen: boolean;
    toggle: () => void;
    selectedContactForEdit: ContactListType | null
    setSelectedContactForEdit: (contact: ContactListType | null) => void
    fetchData: () => void
}