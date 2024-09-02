interface Job {
  Id: number;
  Title: string;
}

interface State {
  Id: number;
  State: string;
}

interface Facility {
  Id: number;
  Name: string;
  Address: string;
  State: State;
}

interface JobApplicationStatus {
  Id: number;
  Status: string;
}

interface JobSpeciality {
  Id: number;
  Speciality: string;
}

export interface ProfessionalGigHistoryJobAssignment {
  Id: number;
  StartDate: string;
  EndDate: string;
  ReqId: string;
  JobApplicationStatus: JobApplicationStatus;
  JobSpeciality: JobSpeciality;
}

export interface ProfessionalGigHistoryType {
  Id: number;
  Job: Job;
  Facility: Facility;
  JobAssignments: ProfessionalGigHistoryJobAssignment[];
}

interface JobProfession {
  Id: number;
  Profession: string;
}

interface JobStatus {
  Id: number;
  Status: string;
}

interface AppliedJob {
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
  IsFeaturedJob: boolean;
  JobType: string;
  CreatedOn: string;
  ApplicantCount: number;
  JobStatus: JobStatus;
  JobProfession: JobProfession;
  JobSpeciality: JobSpeciality;
}

interface JobAssignment {
  Id: number;
  StartDate: string;
  EndDate: string;
  JobApplicationStatus: JobApplicationStatus;
}

interface JobSubmission {
  Id: number;
}

export interface AppliedJobType {
  Id: number;
  AppliedOn: string;
  JobApplicationStatus: JobApplicationStatus;
  Job: AppliedJob;
  Facility: Facility;
  JobSubmission: JobSubmission;
  JobAssignments: JobAssignment[];
}

interface JobInterestState {
  Id: number;
  State: string;
}

interface JobInterestFacility {
  Id: number;
  Name: string;
  Address: string;
  State: JobInterestState;
}

interface JobInterestJobSpeciality {
  Id: number;
  Speciality: string;
}

interface JobInterestJobProfession {
  Id: number;
  Profession: string;
}

interface JobInterestJob {
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
  IsFeaturedJob: boolean;
  JobType: string;
  CreatedOn: string;
  ApplicantCount: number;
  JobStatus: JobStatus;
  JobProfession: JobInterestJobProfession;
  JobSpeciality: JobInterestJobSpeciality;
  Facility: JobInterestFacility;
}

export interface JobInterestType {
  Id: number;
  CreatedOn: string;
  Job: JobInterestJob;
}
