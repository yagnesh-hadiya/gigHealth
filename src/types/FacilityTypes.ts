export interface LocationType {
  srno: number;
  checklistname: string;
  healthsystemname: string;
  healthsystemid: string;
  contactperson: string;
  phone: string;
  email: string;
}

export interface ContactsType {
  name: string;
  title: string;
  phone: string;
  email: string;
  role: string;
}

export interface DocumentsType {
  srno: number;
  documentname: string;
  description: string;
  uploaded: string;
}

export interface Faqs {
  question: string;
  date: string;
  type: string;
}

export interface AddNewDocumentsProps {
  setIsOffCanvasOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOffCanvasOpen: boolean;
}

export interface ComplianceTypes {
  id: number;
  internalUse: boolean;
  priority: number;
  documentname: string;
  description: string;
  expiryDays: number;
}

export interface MultiSelectTypes {
  value: string | number;
  label: string;
}

export type CheckboxValueType = {
  label: string;
  value: string;
  checked: boolean;
};
export type ProgramManager = {
  Id: number;
  FirstName: string;
  LastName: string;
  Role: { Id: number };
};

export type FacilityRoles = {
  Id: number;
  Role: string;
};

export type FacilityType = {
  facilityId: number;
  name: string;
  statusId: number | null;
  type: string;
  healthSystemName: string;
  parentHealthSystemId: string | number | undefined;
  isTeachingHospital: boolean;
  totalTalent: number;
  totalBedCount: number;
  traumaLevelId: number | null;
  contractTypeId: number | null;
  programManagerId: number | null;
  hospitalPhone: string;
  serviceTypeId: number | null;
  address: string;
  stateId: number | null;
  cityId: number | null;
  zipCodeId: number | null;
  internalNotes: string;
  requirements: string;
  primaryContact: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    mobile: string;
    fax?: string | null;
    facilityRoleId: number | null;
  };
  secondaryContact: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    mobile: string;
    fax?: string | null;
    facilityRoleId: number | null;
  };
};

export type FacilityRadioBtn = {
  value: string;
  label: string;
}[];

export type HealthSystemName = {
  Id: number;
  Name: string;
  Facilities: {
    Id: number;
    Name: string;
  };
}[];

export type FacilityList = {
  Id: number;
  Name: string;
  ServiceType: {
    Id: number;
    Type: string;
  };
  FacilityStatus: {
    Id: number;
    Status: string;
  };
  ProgramManager: {
    Id: number;
    FirstName: string;
    LastName: string;
  };
  FacilityHealthSystem: {
    Id: number;
    Name: string;
  };
  ParentHealthSystem: {
    Id: number;
    Name: string;
  } | null;
  State: {
    Id: number;
    State: string;
  };
  City: {
    Id: number;
    City: string;
  };
};

export type SelectOption = {
  value: number;
  label: string;
};

export type BooleanSelectOption = {
  value: boolean;
  label: string;
};

export type EditFacilityList = {
  Address: string;
  BedCount: number;
  City: {
    Id: number;
    City: string;
  };
  CityId: number;
  ContractType: {
    Id: number;
    Type: string;
  };
  FacilityHealthSystem: {
    Id: number;
    Name: string;
  };
  FacilityStatus: {
    Id: number;
    Status: string;
  };
  FacilityType: {
    Id: number;
    Type: string;
  };
  HospitalPhone: string;
  Id: number;
  InternalNotes: string | null;
  IsTeachingHospital: boolean;
  Name: string;
  ParentHealthSystem: {
    Id: number;
    Name: string;
  } | null;
  PrimaryContact: {
    FirstName: string;
    LastName: string;
    Phone: string;
    Title: string;
    Fax: string | null;
    Email: string;
    FacilityRole: {
      Id: number;
      Role: string;
    };
  };
  ProgramManager: {
    Id: number;
    FirstName: string;
    LastName: string;
  };
  Requiremnts: string | null;
  SecondaryContact: {
    FirstName: string;
    LastName: string;
    Phone: string;
    Title: string;
    Fax: string | null;
    Email: string;
    FacilityRole: {
      Id: number;
      Role: string;
    };
  };
  ServiceType: {
    Id: number;
    Type: string;
  };
  State: {
    Id: number;
    State: string;
  };
  StateId: number;
  TalentCountOnAssignment: number;
  TraumaLevel: {
    Id: number;
    Level: string;
  };
  ZipCode: {
    Id: number;
    ZipCode: string;
  };
  ZipCodeId: number;
  ImageUrl: string;
};

export type FacilityDetailsList = {
  data?: {
    Address: string;
    BedCount: number;
    City: {
      Id: number;
      City: string;
    };
    CityId: number;
    ContractType: {
      Id: number;
      Type: string;
    };
    FacilityHealthSystem: {
      Id: number;
      Name: string;
    };
    FacilityStatus: {
      Id: number;
      Status: string;
    };
    FacilityType: {
      Id: number;
      Type: string;
    };
    HospitalPhone: string;
    Id: number;
    InternalNotes: string | null;
    IsTeachingHospital: boolean;
    Name: string;
    ParentHealthSystem: {
      Id: number;
      Name: string;
    } | null;
    PrimaryContact: {
      FirstName: string;
      LastName: string;
      Phone: string;
      Title: string;
      Email: string;
      FacilityRole: {
        Id: number;
        Role: string;
      };
    };
    ProgramManager: {
      Id: number;
      FirstName: string;
      LastName: string;
    };
    Requiremnts: string | null;
    SecondaryContact: {
      FirstName: string;
      LastName: string;
      Phone: string;
      Title: string;
      Email: string;
      FacilityRole: {
        Id: number;
        Role: string;
      };
    };
    ServiceType: {
      Id: number;
      Type: string;
    };
    State: {
      Id: number;
      State: string;
    };
    StateId: number;
    TalentCountOnAssignment: number;
    TraumaLevel: {
      Id: number;
      Level: string;
    };
    ZipCode: {
      Id: number;
      ZipCode: string;
    };
    ZipCodeId: number;
    ImageUrl: string;
  };
  imageLoading: boolean;
  imageURL: string;
};

export type FacilitySidebarMenu = {
  text: string;
  module: string;
  submodule: string;
}[];

export type DraggableDataTableProps = {
  columns: any[];
  data: ComplianceTypes[];
  onRowDrop: (startIndex: number, endIndex: number) => void;
};

export type FacilityImageUploadProps = {
  image?: File | null;
  imageURL?: string;
  onImageUpload: (file: File) => void;
};

export enum ActionTypes {
  SetSelectedFacility = "SetSelectedFacility",
  SetFacility = "SetFacility",
  SetSelectedContract = "SetSelectedContract",
  SetContracts = "SetContracts",
  SetSelectedService = "SetSelectedService",
  SetServices = "SetServices",
  SetSelectedTrauma = "SetSelectedTrauma",
  SetTraumas = "SetTraumas",
  SetSelectedState = "SetSelectedState",
  SetStates = "SetStates",
  SetSelectedCity = "SetSelectedCity",
  SetCities = "SetCities",
  SetSelectedProgramManager = "SetSelectedProgramManager",
  SetProgramManagers = "SetProgramManagers",
  SetSelectedRole = "SetSelectedRole",
  SetRoles = "SetRoles",
  SetSelectedRole2 = "SetSelectedRole2",
  SetSelectedZip = "SetSelectedZip",
  SetZip = "SetZip",
  SetHealthSystem = "SetHealthSystem",
  SetSelectedHealth = "SetSelectedHealth",
  SetFacilityId = "SetFacilityId",
  SetSystemHealthId = "SetSystemHealthId",
  SetSelectedFacilityType = "SetSelectedFacilityType",
  SetTeachingHospital = "SetTeachingHospital",
}

export type FacilityState = {
  selectedFacility: SelectOption | null;
  selectedContract: SelectOption | null;
  selectedService: SelectOption | null;
  selectedTrauma: SelectOption | null;
  selectedState: SelectOption | null;
  selectedCity: SelectOption | null;
  selectedProgramManager: SelectOption | null;
  selectedRole: SelectOption | null;
  selectedRole2: SelectOption | null;
  selectedZip: SelectOption | null;
  selectedHealth: SelectOption | null;
  selectedFacilityType: string;
  teachingHospital: string;
  facilityId: number;
  systemHealthId: number;
  facility: { Id: number; Status: string }[];
  contracts: { Id: number; Type: string }[];
  services: { Id: number; Type: string }[];
  traumas: { Id: number; Level: string }[];
  states: { Id: number; State: string; Code: string }[];
  cities: { Id: number; City: string }[];
  programManagers: { Id: number; FirstName: string; LastName: string }[];
  roles: { Id: number; Role: string }[];
  zip: { Id: number; ZipCode: string }[];
  healthSystem: HealthSystemName;
};

export interface CustomRichTextEditorProps {
  content: string;
  handleChange?: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  disabled?: boolean;
}
