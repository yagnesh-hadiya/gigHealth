import { SetStateAction } from "react";

export type CartListgroupItemProps = {
  title: string;
  data: string;
};

export type TalentJobAssignments = {
  Id: number;
  StartDate: string;
  EndDate: string;
  ComplianceDueDate: string;
  Unit: string | null;
  ReqId: string;
  JobApplicationStatus: {
    Id: number;
    Status: string;
  };
  JobProfession: {
    Id: number;
    Profession: string;
  };
};

export type TalentJobComplianceDocuments = {
  Id: number;
  ProfessionalDocumentId: null;
  ExpiryDate: string | null;
  EffectiveDate: string | null;
  IsApproved: boolean | null;
  ApprovedByUser: {
    Id: number;
    FirstName: string;
    LastName: string;
  } | null;
  ApprovedOn: string | null;
  DocMaster: {
    Id: number;
    Type: string;
    Description: string | null;
  };
  ProfessionalDocument: {
    Id: number;
    FileName: string;
    CreatedOn: string;
    UpdatedOn: string | null;
  } | null;
  JobSuggestedDocCount: {
    Count: number;
  } | null;
};

export type TalentOnboardingListType = {
  Id: number;
  JobId: number;
  JobApplicationId: number;
  ReqId: string | null;
  Job: {
    Id: number;
    Title: string;
    TotalGrossPay: number;
    BillRate: number;
    JobStatus: {
      Id: number;
      Status: string;
    };
    ScrubColor: {
      Id: number;
      Color: string;
    };
  };
  Facility: {
    Id: number;
    Name: string;
    Address: string;
    State: {
      Id: number;
      State: string;
    };
    City: {
      Id: number;
      City: string;
    };
    ZipCode: {
      Id: number;
      ZipCode: string;
    };
  };
  JobApplication: {
    Id: number;
    JobAssignments: TalentJobAssignments[];
    JobComplianceDocuments: TalentJobComplianceDocuments[];
  };
};

export type OnboardingCardInfoProps = {
  list: TalentOnboardingListType;
  fetchData?: () => Promise<void>;
};

export type TalentOnboardingDocumentProps = {
  list: TalentOnboardingListType;
  submittedDocs: TalentJobComplianceDocuments[];
  fetchData: () => Promise<void>;
};

export type TalentOnboardingRequiredDocumentProps = {
  list: TalentOnboardingListType;
  requiredDocs: TalentJobComplianceDocuments[];
  fetchData: () => Promise<void>;
};

export type RequiredDocsUplaodFileProps = {
  list: TalentOnboardingListType;
  file: TalentJobComplianceDocuments;
  fetchData: () => Promise<void>;
};

export type TalentSuggestedDocsType = {
  docId: number;
  docCount: number;
  jobId: number;
  jobApplicationId: number;
  complianceId: number;
  setFetchDetails: () => Promise<void>;
  setPage?: React.Dispatch<SetStateAction<number>>;
  fileName?: string | undefined;
};

export type TalentExpiredDocumentsType = {
  Id: number;
  JobAssignments: TalentJobAssignments[];
  JobComplianceDocuments: TalentJobComplianceDocuments[];
};
