import { SelectOption } from "./FacilityTypes";

export enum JobActions {
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
}

export type JobTemplate = {
  Id: number;
  Title: string;
  JobType: string;
  CreatedOn: string;
  TotalGrossPay: number;
  MinYearsExperience: number;
  ContractLength: number;
  Location: string;
  JobProfession: {
    Id: number;
    Profession: string;
  };
  JobSpeciality: {
    Id: number;
    Speciality: string;
  };
  EmploymentType: {
    Id: number;
    Type: string;
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
  DeleteHandler: () => void;
};

export type ComplianceDetails = {
  Id: number;
  Name: string;
  ComplianceDocuments: [
    {
      ExpiryDurationDays: number;
      IsInternalUse: boolean;
      Priority: number;
      DocumentMaster: {
        Id: number;
        Type: string;
      };
      DocumentCategory: {
        Id: number;
        Category: string;
      };
    }
  ];
};

export type JobState = {
  selectedTemplate: SelectOption | null;
  selectedProfession: SelectOption | null;
  selectedSpecialities: SelectOption | null;
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
  featuredJob: boolean;
  facilityName: string;
  programManager: string;
  cardDetails: JobTemplate[];
  search: string;
  selectedContractStartDate: Date | string;
  documentList: { Id: number; Category: string }[];
  shiftTime: { Id: number; Shift: string }[];
  selectedShiftTime: SelectOption | null;
};

export type JobTemplateData = {
  name: string;
  statusId: number;
  type: string;
  healthSystemName: string;
  parentHealthSystemId: number;
  isTeachingHospital: boolean;
  totalTalent: number;
  totalBedCount: number;
  traumaLevelId: number;
  contractTypeId: number;
  programManagerId: number;
  hospitalPhone: string;
  serviceTypeId: number;
  address: string;
  stateId: number;
  cityId: number;
  zipCodeId: number;
  primaryContact: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    mobile: number;
    facilityRoleId: number;
  };
};

export type TimeOptions = {
  label: string;
  value: string;
};

export type JobType = {
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

export type ForamttedDocumentData = {
  description: string;
  documentname: string;
  expiryDays: number;
  id: number;
  internalUse: boolean;
  priority: number;
};

export type ApiDocumentData = {
  ExpiryDurationDays: number;
  IsInternalUse: boolean;
  Priority: number;
  DocumentMaster: {
    Id: number;
    Type: string;
    Description: string;
  };
  DocumentCategory: {
    Id: number;
    Category: string;
  };
};

// Id: number,
// Title: string,
// BillRate: number,
// MinYearsExperience: number,
// Contract: string,
// NoOfOpenings: number,
// Location: string,
// DeptUnit: number,
// Description: string,
// InternalNotes: string,
// ContractStartDate: string,
// ShiftStartTime: string,
// ShiftEndTime: string,
// NoOfShifts: number,
// ContractLength: number,
// HrsPerWeek: number,
// ShiftTime: string,
// GrossPay: number,
// RegularHourlyRate: number,
// HousingStipend: number,
// MealsAndIncidentals: number,
// TotalGrossPay: number,
// CompensationComments: string,
// OvertimeRate: number,
// HolidayRate: number,
// OnCallRate: number,
// CallBackRate: number,
// TravelReimbursement: number,
// IsFeaturedJob: boolean,
// JobProfession: {
//     Id: number,
//     Profession: string
// },
// JobSpeciality: {
//     Id: number,
//     Speciality: string
// },
// EmploymentType: {
//     Id: number,
//     Type: string
// },
// Facility: {
//     Id: number,
//     Name: string,
//     ProgramManager: {
//         Id: number,
//         FirstName: string,
//         LastName: string
//     }
// },
// JobStatus: {
//     Id: number,
//     Status: string
// },
// ScrubColor: {
//     Id: number,
//     Color: string
// },
// ComplianceChecklist: {
//     Id: number,
//     Name: string,
//     ComplianceDocuments: [
//         {
//             ExpiryDurationDays: number,
//             IsInternalUse: boolean,
//             Priority: number,
//             DocumentMaster: {
//                 Id: number,
//                 Type: string
//             },
//             DocumentCategory: {
//                 Id: number
//             }
//         },
//         {
//             ExpiryDurationDays: number,
//             IsInternalUse: false,
//             Priority: number,
//             DocumentMaster: {
//                 Id: number,
//                 Type: string
//             },
//             DocumentCategory: {
//                 Id: number
//             }
//         }
//     ]
// }
