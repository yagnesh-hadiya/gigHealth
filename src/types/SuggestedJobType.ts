interface Job {
  Id: number;
  Title: string;
  ContractLength: string;
}

interface Facility {
  Id: number;
  Name: string;
  Address: string;
}

interface JobApplicationStatus {
  Id: number;
  Status: string;
}

interface JobProfession {
  Id: number;
  Profession: string;
}

interface JobSpeciality {
  Id: number;
  Speciality: string;
}
interface JobShift {
  Id: number;
  Shift: string;
}
type JobRequestingTimeOffsType = { Date: string };

interface OfferedList {
  Id: number;
  Unit: string;
  RegularHrs: number;
  OverTimeHrs: number;
  TotalHrs: number;
  TotalDaysOnAssignment: number;
  GauranteedHrs: number;
  ComplianceDueDate: string;
  Notes: string;
  RegularRate: number;
  OvertimeRate: number;
  DoubleTimeRate: number;
  HolidayRate: number;
  ChargeRate: number;
  OnCallRate: number;
  CallbackRate: number;
  MealsAndIncidentials: number;
  HousingStipend: number;
  StartDate: string;
  EndDate: string;
  ShiftStartTime: string;
  TravelReimbursement: number;
  TotalGrossPay: number;
  ShiftEndTime: string;
  JobApplicationId: number;
  Job: Job;
  JobShift: JobShift;
  Facility: Facility;
  JobApplicationStatus: JobApplicationStatus;
  JobProfession: JobProfession;
  JobSpeciality: JobSpeciality;
  JobRequestingTimeOffs?: JobRequestingTimeOffsType[];
}

interface JobApplicationStatus {
  Id: number;
  Status: string;
}

interface DocumentMaster {
  Id: number;
  Type: string;
}

interface ProfessionalDocument {
  Id: number;
  FileName: string;
}

interface JobComplianceDocument {
  Id: number;
  ProfessionalDocumentId: number | null;
  ExpiryDate: string | null;
  DocumentMaster: DocumentMaster;
  ProfessionalDocument: ProfessionalDocument | null;
}

interface Facility {
  Id: number;
  Name: string;
  Address: string;
}

interface AssignmentList {
  Id: number;
  Unit: string;
  RegularHrs: number;
  OverTimeHrs: number;
  TotalHrs: number;
  TotalDaysOnAssignment: number;
  GauranteedHrs: number;
  ComplianceDueDate: string;
  Notes: string;
  RegularRate: number;
  OvertimeRate: number;
  DoubleTimeRate: number;
  HolidayRate: number;
  ChargeRate: number;
  OnCallRate: number;
  CallbackRate: number;
  MealsAndIncidentials: number;
  HousingStipend: number;
  StartDate: string;
  EndDate: string;
  ShiftStartTime: string;
  ShiftEndTime: string;
  TravelReimbursement: string;
  IsExtension: boolean;
  JobApplicationStatus: JobApplicationStatus;
  JobComplianceDocuments: JobComplianceDocument[];
  Facility: Facility;
}

interface SuggestedJob {
  Id: number;
  Title: string;
  HrsPerWeek: number;
  NoOfOpenings: number;
  TotalGrossPay: number;
  JobType: string;
  CreatedOn: string;
  JobSpeciality: {
    Id: number;
    Speciality: string;
  };
  JobProfession: {
    Id: number;
    Profession: string;
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
