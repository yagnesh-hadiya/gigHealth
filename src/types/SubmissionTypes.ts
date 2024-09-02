interface JobApplicationStatus {
  Id: number;
  Status: string;
}

interface State {
  Id: number;
  State: string;
  Code: string;
}

interface Professional {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Experience: number;
  State: State;
}

type JobSubmission = {
  Id: number;
  IsPdfGenerated: boolean;
  IsPdfGeneartionFailed: boolean;
  IsPdfGenerationStarted: boolean;
  CreatedOn: string;
};

export interface SubmissionTypes {
  Id: number;
  AppliedOn: string;
  JobApplicationStatus: JobApplicationStatus;
  Professional: Professional;
  JobSubmission: JobSubmission;
}

interface RejectedJobAssignment {
  Id: number;
  StatusUpdatedOn: string | null;
  StartDate: string;
  EndDate: string;
  JobApplicationStatus: {
    Id: number;
    Status: string;
  };
}

export interface RejectedProfessional {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Experience: number;
}

export interface RejectedSubmissionType {
  Id: number;
  AppliedOn: string;
  StatusUpdatedOn: string | null;
  JobSubmission: {
    Id: number;
  };
  JobApplicationStatus: {
    Id: number;
    Status: string;
  };
  JobAssignments: RejectedJobAssignment[];
  Professional: RejectedProfessional;
}
