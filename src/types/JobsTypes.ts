import { SetStateAction } from "react";
import { SelectOption } from "./FacilityTypes";
import { ComplianceDetails, JobTemplate } from "./JobTemplateTypes";

export enum JobsActions {
  SetSelectedSpecialities = "SetSelectedSpecialities",
  SetSpeciality = "SetSpeciality",
  SetSelectedTemplate = "SetSelectedTemplate",
  SetTemplate = "SetTemplate",
  SetSelectedProfession = "SetSelectedProfession",
  SetProfession = "SetProfession",
  SetSelectedContract = "SetSelectedContract",
  SetContract = "SetContract",
  SetSelectedJobStatus = "SetSelectedJobStatus",
  SetJobStatus = "SetJobStatus",
  SetSelectedEmploymentType = "SetSelectedEmploymentType",
  SetEmploymentType = "SetEmploymentType",
  EmploymentType = "EmploymentType",
  SetSelectedScrub = "SetSelectedScrub",
  SetScrub = "SetScrub",
  SetSelectedShiftStart = "SetSelectedShiftStart",
  SetShiftStart = "SetShiftStart",
  SetSelectedShiftEnd = "SetSelectedShiftEnd",
  SetShiftEnd = "SetShiftEnd",
  SetSelectedChecklist = "SetSelectedChecklist",
  SetChecklist = "SetChecklist",
  SetJobTemplate = "SetJobTemplate",
  SetSelectedComplianceList = "SetSelectedComplianceList",
  SetComplianceList = "SetComplianceList",
  SetSelectedComplianceDetails = "SetSelectedComplianceDetails",
  SetComplianceDetails = "SetComplianceDetails",
  SetFacilityName = "SetFacilityName",
  SetCardDetails = "SetCardDetails",
  SetProgramManager = "SetProgramManager",
  SetSelectedContractStart = "SetSelectedContractStart",
  SetDocumentList = "SetDocumentList",
  SetShiftTime = "SetShiftTime",
  SetSelectedShiftTime = "SetSelectedShiftTime",
  SetSearch = "SetSearch",
  SetContent = "SetContent",
  SetFacility = "SetFacility",
  SetSelectedFacility = "SetSelectedFacility",
  SetJobId = "SetJobId",
  SetActiveContract = "SetActiveContract",
  SetPostToWebsite = "SetPostToWebsite",
  SetDaysOnAssignment = "SetDaysOnAssignment",
  SetSelectedDaysOnAssignment = "SetSelectedDaysOnAssignment",
  SetReqId = "SetReqId",
  SetFormattedReqId = "SetFormattedReqId",
  SetSelectedState = "SetSelectedState",
  SetState = "SetState",
  SetFilter = "SetFilter",
  SetCount = "SetCount",
  SetActiveIndex = "SetActiveIndex",
}

export type JobsState = {
  selectedTemplate: SelectOption | null;
  selectedProfession: { Id: number; Profession: string } | null;
  selectedSpecialities: { Id: number; Speciality: string } | null;
  selectedContract: SelectOption | null;
  selectedJobStatus: SelectOption | null;
  selectedEmploymentType: SelectOption | null;
  selectedScrub: { Id: number; Color: string } | null;
  selectedShiftStart: { value: string; label: string } | null;
  selectedShiftEnd: { value: string; label: string } | null;
  selectedChecklist: SelectOption | null;
  scrub: { Id: number; Color: string }[];
  profession: { Id: number; Profession: string }[];
  employmentType: { Id: number; Type: string }[];
  jobStatus: { Id: number; Status: string }[];
  speciality: { Id: number; Speciality: string }[];
  jobTemplate: JobTemplate[];
  contract: { Id: number; Type: string }[];
  selectedComplianceList: { Id: number; Name: string }[];
  complianceDetails: ComplianceDetails[];
  complianceList: { Id: number; Name: string }[];
  facilityName: string;
  programManager: string;
  cardDetails: JobTemplate[];
  search: string;
  selectedContractStartDate: Date | string;
  documentList: { Id: number; Category: string }[];
  shiftTime: { Id: number; Shift: string }[];
  selectedShiftTime: { Id: number; Shift: string } | null;
  content: string;
  facility: JobsFacility[];
  selectedFacility: JobsFacility | null;
  jobId: number | null;
  activeContract: ActiveContract[];
  postToWebsite: boolean;
  selectedDaysOnAssignment: SelectOption | null;
  reqIds: { slotNumber: number; reqId: string }[];
  formattedReqId: { slotNumber: number; reqId: string }[];
  states: { Id: number; State: string; Code: string }[];
  selectedState: SelectOption | null;
  filter: number;
  count: {
    professionCount: boolean;
    specialityCount: boolean;
    statesCount: boolean;
    shfitCount: boolean;
  };
  activeIndex: number | null;
};

export type JobsTypes = {
  title: string;
  billRate: number;
  professionId: number;
  jobStatusId: number;
  specialityId: number;
  minYearsOfExperience: number;
  contract: string;
  jobType: string;
  noOfOpenings: number;
  location: string;
  deptUnit: number;
  employementTypeId: number;
  scrubColorId: number;
  description: string;
  internalJobNotes: string;
  complianceChecklistId: number;
  contractDetails: {
    startDate: string;
    shiftStartTime: string;
    shiftEndTime: string;
    noOfShifts: number;
    contractLength: number;
    hrsPerWeek: number;
    shiftId: number;
    daysOnAssignment: number;
    overtimeHrsPerWeek?: number;
  };
  pay: {
    hourlyRate: number;
    housingStipend: number;
    mealsAndIncidentals: number;
    compensationComments?: string;
    overtimeRate: number;
    holidayRate: number;
    onCallRate: number;
    callBackRate: number;
    travelReimbursement: number;
    doubleTimeRate?: number;
  };
};

export type JobsFacility = {
  Id: number;
  Name: string;
  ProgramManager: {
    Id: 2;
    FirstName: string;
    LastName: string;
  };
};

export type ActiveContract = {
  ContactName: string;
  ContactNumber: string;
  WorkWeek: string;
  SuperAdminFee: number;
  NonBillableOrientation: string;
  HolidayMultiplier: number;
  IncludedHolidays: string;
  CallBackMultiplier: number;
  GauranteedHrs: number;
  HolidayBillingRules: string;
  CostCenters: string;
  KronosTimeCodes: string;
  MissedPunchPayrollProcess: string;
  OnCallRate: number;
  OvertimeMultiplier: number;
  DoubletimeMultiplier: number;
  OvertimeThreshold: number;
  SpecialBillingDetails: string;
  TimekeepingProcess: string;
  TimeRoundingGuidelines: string;
  ActivationStatus: boolean;
  PaymentTerm: {
    Id: number;
    Term: string;
  };
  ContractDocuments: [
    {
      Id: number;
      FileName: string;
      Notes: string;
      CreatedOn: string;
    }
  ];
};

export type JobsListType = {
  Id: number;
  Title: string;
  BillRate: number;
  MinYearsExperience: number;
  Contract: string;
  NoOfOpenings: number;
  Location: string;
  ContractStartDate: string;
  ContractLength: number;
  TotalGrossPay: number;
  JobType?: string;
  CreatedOn: string;
  ApplicantCount: number;
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
  };
};

export type JobsCardProps = {
  Id: number;
  JobStatus: { Id: number; Status: string }[];
  Title: string;
  TotalGrossPay: number;
  MinYearsExperience: number;
  Profession: string;
  ContractLength: number;
  BillRate: number;
  NoOfOpenings: number;
  Location: string;
  Speciality: string;
  Name: string;
  Address: string;
  ContractStartDate: string;
  CreatedOn: string;
  ApplicantCount: number;
  Status: { Id: number; Status: string };
  Facility: {
    Id: number;
    Name: string;
    ProgramManager?: {
      Id: number;
      FirstName: string;
      LastName: string;
    };
  };
  setFetchRightJobCard: React.Dispatch<SetStateAction<boolean>>;
};

export type LeftJobContentProps = {
  search: string;
  jobStatus: { Id: number; Status: string }[];
  selectedJobStatus: { Id: number; Status: string } | null;
  startDate: null | Date;
  endDate: null | Date;
  setIds: React.Dispatch<
    SetStateAction<{ facilityId: number | string; templateId: number | string }>
  >;
  // searchByDate: boolean;
  setFetchRightJobCard: React.Dispatch<SetStateAction<boolean>>;
};

export type JobHeaderProps = {
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
  // handleDateListener: () => void;
};

export type FilterModalProps = {
  filterModal: boolean;
  toggleFilter: () => void;
  profession: { Id: number; Profession: string }[];
  speciality: { Id: number; Speciality: string }[];
  states: { Id: number; State: string; Code: string }[];
  shiftTime: { Id: number; Shift: string }[];
  currentState: JobsState;
  dispatch: React.Dispatch<any>;
  fetchJobsList: () => void;
  pageRef: { current: number };
  setAbort: React.Dispatch<React.SetStateAction<boolean>>;
  handleProfessionCategory: any;
  categoryProfession: any;
  professionCategory: any;
  setCategoryProfession: any;
  setProfessionId: any;
  // setApply: React.Dispatch<React.SetStateAction<boolean>>;
};

export type JobContentProps = {
  search: string;
  jobStatus: { Id: number; Status: string }[];
  selectedJobStatus: { Id: number; Status: string } | null;
  startDate: null | Date;
  endDate: null | Date;
  // searchByDate: boolean;
};

export type LeftContentHeaderProps = {
  profession: { Id: number; Profession: string }[];
  speciality: { Id: number; Speciality: string }[];
  states: { Id: number; State: string; Code: string }[];
  shiftTime: { Id: number; Shift: string }[];
  currentState: JobsState;
  dispatch: React.Dispatch<any>;
  fetchJobsList: () => void;
  pageRef: { current: number };
  setSort: React.Dispatch<
    SetStateAction<{ sortkey: string; sortDir: string; sortBehavior: string }>
  >;
  sort: { sortkey: string; sortDir: string; sortBehavior: string };
  totalCountRef: { current: number };
  handleExport: () => void;
  setAbort: React.Dispatch<React.SetStateAction<boolean>>;
  handleProfessionCategory: any;
  categoryProfession: any;
  professionCategory: any;
  setCategoryProfession: any;
  setProfessionId: any;
};

export type JobModalProps = {
  filterModal: boolean;
  toggleFilter: () => void;
};

export type RightJobContentData = {
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
  JobType?: string;
  CreatedOn: string;
  ApplicantCount: number;
  OvertimeHrsPerWeek: number;
  DaysOnAssignment: number;
  DoubleTimeRate?: number;
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

export type JobSidebarProps = {
  setActiveComponent: (component: string) => void;
  activeComponent: string;
};

export type JobSidebarMenu = {
  text: string;
  module: string;
  submodule: string;
};

export type FacilityJobsCard = [
  {
    Id: number;
    Title: string;
    BillRate: number;
    MinYearsExperience: number;
    Contract: string;
    NoOfOpenings: number;
    Location: string;
    ContractStartDate: string;
    ContractLength: number;
    TotalGrossPay: number;
    JobType: string;
    CreatedOn: string;
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
    };
  }
];

export type FacilityJobCardProps = {
  JobData: {
    Id: number;
    Title: string;
    BillRate: number;
    MinYearsExperience: number;
    Contract: string;
    NoOfOpenings: number;
    Location: string;
    ContractStartDate: string;
    ContractLength: number;
    TotalGrossPay: number;
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
    };
  };
  state: JobsState;
};

export interface TerminateModalProps {
  isOpen: boolean;
  toggle: () => void;
}
