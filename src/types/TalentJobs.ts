import { SetStateAction } from "react";

export type TalentJobsListingType = {
  Id: number;
  Title: string;
  HrsPerWeek: number;
  NoOfOpenings: number;
  TotalGrossPay: number;
  JobType: string;
  CreatedOn: string;
  JobStatusId: number;
  JobProfession: {
    Id: number;
    Profession: string;
  };
  JobSpeciality: {
    Id: number;
    Speciality: string;
  };
  JobStatus: {
    Id: number;
    Status: string;
  };
  Facility: {
    Id: number;
    Name: string;
    Address: string;
    State: {
      Id: number;
      State: string;
    };
    FacilityStatus: {
      Id: number;
      Status: string;
    };
  };
  JobApplications: JobApplicationType[];
  JobInterests: JobInterestType[];
};

export type JobApplicationType = {
  Id: number;
  JobApplicationStatus: {
    Id: number;
    Status: string;
  };
};

export type JobInterestType = {
  Id: number;
  CreatedOn: string;
};

type JobStatus = {
  Id: number;
  Status: string;
};

type JobProfession = {
  Id: number;
  Profession: string;
};

type JobSpeciality = {
  Id: number;
  Speciality: string;
};

type State = {
  Id: number;
  State: string;
};

type Facility = {
  Id: number;
  Name: string;
  Address: string;
  State: State;
};

type DocumentMaster = {
  Id: number;
  Type: string;
  Description: string;
  CoreCompDocuments: {
    Id: number;
  } | null;
};

type DocumentCategory = {
  Id: number;
  Category: string;
};

export type CompDocuments = {
  Id: number;
  Priority: number;
  DocumentMaster: DocumentMaster;
  DocumentCategory: DocumentCategory;
};

export type CompChecklist = {
  Id: number;
  Name: string;
  CompDocuments: CompDocuments[];
};

type JobInterest = {
  Id: number;
  CreatedOn: string;
};

export type TalentJobDetailsType = {
  Id: number;
  Title: string;
  BillRate: number;
  MinYearsExperience: number;
  Contract: string;
  NoOfOpenings: number;
  Location: string;
  DeptUnit: string;
  Description: string | null;
  InternalNotes: string;
  ContractStartDate: string;
  ShiftStartTime: string;
  ShiftEndTime: string;
  NoOfShifts: number;
  ContractLength: number;
  HrsPerWeek: number;
  RegularHourlyRate: number;
  HousingStipend: number;
  MealsAndIncidentals: number;
  TotalGrossPay: number;
  CompensationComments: string;
  OvertimeRate: number;
  HolidayRate: number;
  OnCallRate: number;
  CallBackRate: number;
  DoubleTimeRate: number;
  TravelReimbursement: number;
  JobType: string;
  PostToWebsite: boolean;
  CreatedOn: string;
  OvertimeHrsPerWeek: number;
  DaysOnAssignment: number;
  JobProfession: JobProfession;
  JobSpeciality: JobSpeciality;
  Facility: Facility;
  JobStatus: JobStatus;
  JobShift: {
    Id: number;
    Shift: string;
  };
  CompChecklist: CompChecklist[];
  JobApplications: JobApplicationType[];
  JobInterests: JobInterest[];
  Image: string;
};

export type MissingDocModalProps = {
  isOpen: boolean;
  toggle: () => void;
  requiredDocs: CompChecklist;
  setFetchDetails: React.Dispatch<SetStateAction<boolean>>;
};

export type WithdrawModalProps = {
  isOpen: boolean;
  toggle: () => void;
  onWithdraw: () => void;
};

export type ApplyTalentProfessionalType = {
  startDate: string;
  requestTimeOff?: string[];
  bestTimeToSpeak: string;
};

export type ConfirmApplyModalProps = {
  isOpen: boolean;
  toggle: () => void;
  setFetchDetails?: React.Dispatch<SetStateAction<boolean>>;
  toggleThankYouModal?: () => void;
  toggleDocModal?: () => void;
};

export type SuggestedDocumentList = {
  Id: number;
  CreatedOn: string;
  ProfessionalDocumentId: number;
  DocumentMaster: {
    Id: number;
    Type: string;
    Description: string;
  };
};

export type SuggestedJobsType = {
  count: number;
  rows: SuggestedDocumentList[];
};

export type SelecSuggestedDocumentType = {
  docId: number;
  docCount: number;
  setFetchDetails: React.Dispatch<SetStateAction<boolean>>;
  setPage: React.Dispatch<SetStateAction<number>>;
  filename: string;
};

export type Document = {
  document: {
    CreatedOn: string;
    DocumentMaster: {
      Description: string;
      Id: number;
      Type: string;
    };
    Id: number;
    ProfessionalDocumentId: number;
  };
  label: string;
  value: number;
};
