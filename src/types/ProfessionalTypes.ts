import { SetStateAction } from "react";

export type ProfessionalStatusType = {
  Id: number;
  Status: string;
};

export type ProgramManagerType = {
  Id: number;
  FirstName: string;
  LastName: string;
};

export type LocationType = {
  Id: number;
  State: string;
  Code: string;
};

export interface ProfessionalType {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  ActivationStatus: boolean;
  State: {
    Id: number;
    State: string;
  };
  ProfessionalStatus: ProfessionalStatusType;
  ProgramManager: ProgramManagerType | null;
  EmploymentExpert: {
    Id: 3;
    FirstName: string;
    LastName: string;
  };
}

export interface ProfessionalFormType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  stateId: number;
  cityId: number;
  zipCodeId: number;
  professionId: number;
  primarySpecialityId: number;
  experience: number;
  preferredLocationIds: number[];
}

export interface ProfessionCategoryType {
  Id: number;
  Category: string;
}
export interface ProfessionSubCategoryType {
  Id: number;
  Profession: string;
}

export type ProfessionalSidebarMenu = {
  text: string;
  module: string;
  submodule: string;
  additionalText?: string;
}[];

export type ProfessionalHeaderProps = {
  search: string;
  handleSearch: (text: string) => void;
  jobStatus: { Id: number; Status: string }[];
  selectedJobStatus: { Id: number; Status: string } | null;
  setSelectedJobStatus: (
    selectedJobStatus: { Id: number; Status: string } | null
  ) => void;
  startDate: Date | null;
  setStartDate: React.Dispatch<SetStateAction<null | Date>>;
  endDate: Date | null;
  setEndDate: React.Dispatch<SetStateAction<null | Date>>;
  handleDateListener: () => void;
};
export type RightProfessionalContentData = {
  Id: number;
  Title: string;
  BillRate: number;
  MinYearsExperience: number;
  Contract?: string;
  NoOfOpenings: number;
  Location: string;
  DeptUnit?: number;
  Description: string;
  InternalNotes?: string;
  ContractStartDate: string;
  ShiftStartTime: string;
  ShiftEndTime: string;
  NoOfShifts: number;
  ContractLength: number;
  HrsPerWeek: number;
  GrossPay?: number;
  RegularHourlyRate: number;
  HousingStipend: number;
  MealsAndIncidentals: number;
  TotalGrossPay: number;
  CompensationComments?: string;
  OvertimeRate?: number;
  HolidayRate: number;
  OnCallRate: number;
  CallBackRate?: number;
  TravelReimbursement: number;
  IsFeaturedJob?: boolean;
  JobType?: string;
  CreatedOn: string;
  JobProfession: {
    Id: number;
    Profession: string;
  };
  JobSpeciality: {
    Id: number;
    Speciality: string;
  };
  EmploymentType?: {
    Id: number;
    Type: string;
  };
  Facility: {
    Id: number;
    Name: string;
    ProgramManager: {
      Id: number;
      FirstName: string;
      LastName: string;
    };
  };
  JobStatus?: {
    Id: number;
    Status: string;
  };
  ScrubColor?: {
    Id: number;
    Color: string;
  };
  JobShift?: {
    Id: number;
    Shift: string;
  };
  CompChecklist: {
    Id: number;
    Name: string;
    CompDocuments: {
      ExpiryDurationDays: number;
      IsInternalUse: boolean;
      Priority: number;
      DocumentMaster: {
        Id: number;
        Type: string;
      };
      DocumentCategory: {
        Id: number;
      };
    }[];
  };
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
export type ProfNotesActivityModalProps = {
  isOpen: boolean;
  toggle: () => void;

  pageRef: { current: number };
};

type DocumentMaster = {
  Id: number;
  Type: string;
};

type JobComplianceDocument = {
  Id: number;
  ExpiryDate: string | null;
  EffectiveDate: string | null;
  CreatedOn: string;
  DocumentMaster: DocumentMaster;
};

type State = {
  Id: number;
  State: string;
};

type License = {
  Id: number;
  Name: string;
  LicenseNumber: string;
  Expiry: string;
  IsActiveCompact: boolean;
  State: State;
};

type Certification = {
  Id: number;
  Name: string;
  Expiry: string;
};

export type ProfessionalDocumentType = {
  Id: number;
  FileName: string;
  CreatedOn: string;
  UpdatedOn: string | null;
  License: License | null;
  Certification: Certification | null;
  JobComplianceDocument: JobComplianceDocument | null;
};
