export interface Contact {
    FirstName: string;
    LastName: string;
    Title?: string;
    Email: string;
    Phone: string;
}
export interface Facility {
    Id: number;
    Name: string;
    PrimaryContact: Contact | null;
    SecondaryContact?: Contact | null;
}
export interface ParentHealthSystem {
    ParentHealthSystemName: string;
    Id: number;
    Facility: Facility;
}
export interface FacilityData {
    Id: number;
    Name: string;
    ParentHealthSystem?: {
        Name: string;
    };
    PrimaryContact: Contact | null;
    SecondaryContact: Contact | null;
}

export interface ParentResponse {
    children: null;
    parent: ParentHealthSystem;
}

export interface ChildResponse {
    children: FacilityData[];
    parent: null;
}