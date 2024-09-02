interface Professional {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
}

interface JobProfession {
  Id: number;
  Profession: string;
}

interface JobApplicationStatus {
  Id: number;
  Status: string;
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

interface JobApplication {
  Id: number;
  Professional: Professional;
  JobAssignments: JobAssignment[];
}

export interface UpcomingAssignment {
  Id: number;
  StartDate: string;
  EndDate: string;
  ComplianceDueDate: string;
  Unit: string;
  ReqId: string;
  JobApplicationStatus: JobApplicationStatus;
}

export interface RosterType {
  Id: number;
  JobId: number;
  FacilityId: number;
  JobApplicationId: number;
  ReqId: string | null;
  JobApplication: JobApplication;
  UpcomingAssignments: UpcomingAssignment[];
}
