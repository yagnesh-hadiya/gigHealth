type JobProfession = {
  Id: number;
  Profession: string;
};

type Job = {
  Id: number;
  DeptUnit: string;
  JobProfession: JobProfession;
};

type JobSubmission = {
  Id: number;
  AvailableStartDate: string;
  Unit: string;
};
interface JobApplicationStatus {
  Id: number;
  Status: string;
}

interface Professional {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
}

export interface FacilityGigHistoryJobAssignment {
  Id: number;
  StartDate: string;
  EndDate: string;
  Unit: string;
  ReqId: string | null;
  JobApplicationStatus: JobApplicationStatus;
  JobProfession: JobProfession;
}

export interface FacilityGigHistoryType {
  Id: number;
  JobId: number;
  Job: Job;
  AvailableStartDate: string;
  JobSubmission: JobSubmission;
  JobApplicationStatus: JobApplicationStatus;
  Professional: Professional;
  JobAssignments: FacilityGigHistoryJobAssignment[];
}
