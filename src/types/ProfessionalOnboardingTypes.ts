type JobStatus = {
  Id: number;
  Status: string;
};

type State = {
  Id: number;
  State: string;
};

type City = {
  Id: number;
  City: string;
};

type ZipCode = {
  Id: number;
  ZipCode: string;
};

type Facility = {
  Id: number;
  Name: string;
  Address: string;
  State: State;
  City: City;
  ZipCode: ZipCode;
};

type JobApplicationStatus = {
  Id: number;
  Status: string;
};

type JobProfession = {
  Id: number;
  Profession: string;
};

type JobAssignment = {
  Id: number;
  StartDate: string;
  EndDate: string;
  ComplianceDueDate: string;
  ReqId: string;
  Unit: string;
  JobApplicationStatus: JobApplicationStatus;
  JobProfession: JobProfession;
};

interface DocumentMaster {
  Id: number;
  Type: string;
}

interface ProfessionalDocument {
  Id: number;
}

interface JobComplianceDocument {
  Id: number;
  ProfessionalDocumentId: number | null;
  ExpiryDate: string | null;
  DocumentMaster: DocumentMaster;
  ProfessionalDocument: ProfessionalDocument | null;
}

type JobApplication = {
  Id: number;
  JobAssignments: JobAssignment[];
  JobComplianceDocuments: JobComplianceDocument[];
};

type Job = {
  Id: number;
  Title: string;
  TotalGrossPay: number;
  BillRate: number;
  JobStatus: JobStatus;
};

export type ProfessionalOnboardingType = {
  Id: number;
  JobId: number;
  JobApplicationId: number;
  ReqId: string;
  Job: Job;
  Facility: Facility;
  JobApplication: JobApplication;
};

interface DocumentMaster {
  Id: number;
  Type: string;
  Description: string;
}

interface ProfessionalDocument {
  Id: number;
  FileName: string;
  UpdatedOn: string | null;
  CreatedOn: string;
}

interface ApprovedByUser {
  Id: number;
  FirstName: string;
  LastName: string;
}

type JobSuggestedDocCount = {
  Count: number;
};

export interface ProfessionalOnboardingDocumentType {
  Id: number;
  IsRequired: boolean;
  IsApproved: boolean;
  ApprovedOn: string;
  EffectiveDate: string | null;
  ExpiryDate: string | null;
  IsInternalUse: boolean;
  DocumentMaster: DocumentMaster;
  ProfessionalDocument: ProfessionalDocument | null;
  ApprovedByUser: ApprovedByUser | null;
  JobSuggestedDocCount: JobSuggestedDocCount;
}
