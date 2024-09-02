interface JobApplicationStatus {
  Id: number;
  Status: string;
}

interface JobProfession {
  Id: number;
  Profession: string;
}

interface JobAssignment {
  Id: number;
  StartDate: string;
  EndDate: string;
  ReqId: string;
  ComplianceDueDate: string;
  Unit: string;
  JobApplicationStatus: JobApplicationStatus;
  JobProfession: JobProfession;
}

interface Professional {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
}

interface Document {
  Id: number;
  ProfessionalDocumentId: number | null;
  ExpiryDate: string | null;
  DocumentMaster: {
    Id: number;
    Type: string;
  };
  ProfessionalDocument: {
    Id: number;
  } | null;
}

interface JobApplication {
  Id: number;
  DocCount: number;
  UploadedDocCount: number;
  Professional: Professional;
  JobComplianceDocuments: Document[];
  JobAssignments: JobAssignment[];
}

export interface FacilityOnboardingType {
  Id: number;
  JobId: number;
  ReqId: string;
  JobApplication: JobApplication;
}
