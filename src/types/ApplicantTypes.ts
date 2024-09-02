type StateType = {
  Id: number;
  State: string;
  Code: string;
};
export type JobApplicationStatusType = {
  Id: number;
  Status: string;
};

type ApplicantProfessionalType = {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Experience: number;
  State: StateType;
};

export type ApplicantType = {
  Id: number;
  AppliedOn: string;
  JobApplicationStatus: JobApplicationStatusType;
  Professional: ApplicantProfessionalType;
};

type JobSpeciality = {
  Id: number;
  Speciality: string;
};

type Job = {
  Id: number;
  Title: string;
  JobSpeciality: JobSpeciality;
};

type JobSlotStatus = {
  Id: number;
  Status: string;
};

type Professional = {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
};

type JobApplicationStatus = {
  Id: number;
  Status: string;
};

type JobAssignment = {
  Id: number;
  ReqId: string;
  StartDate: string;
  EndDate: string;
  ComplianceDueDate: string;
  JobApplicationStatus: JobApplicationStatus;
  AssignmentStatus: string;
  Profession: string;
  Speciality: string;
};

type JobApplication = {
  Id: number;
  Professional: Professional;
  JobComplianceDocuments: Document[];
};

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

export type SlotType = {
  Id: number;
  SlotNumber: number;
  ReqId: string | null;
  Job: Job;
  JobSlotStatus: JobSlotStatus;
  JobApplication: JobApplication | null;
  JobAssignment: JobAssignment;
};

type PayDetails = {
  regularRate: number;
  overTimeRate: number;
  doubleTimeRate: number;
  holidayRate: number;
  chargeRate: number;
  onCallRate: number;
  callBackRate: number;
  mealsAndIncidentals: number;
  housingStipend: number;
  travelReimbursement: number;
};

type BillingDetails = {
  billRate: number;
  overTimeBillRate: number;
  doubleTimeBillRate: number;
  holidayBillRate: number;
  chargeBillRate: number;
  onCallBillRate: number;
  callBackBillRate: number;
};

export type OfferFormType = {
  startDate: string;
  endDate: string;
  shiftStartTime: string;
  shiftEndTime: string;
  specialityId: number;
  professionId: number;
  unit: string;
  shiftId: number;
  approvedTimeOff?: string[];
  regularHrs: number;
  overtimeHrs: number;
  totalHrsWeekly: number;
  totalDaysOnAssignment: number;
  gauranteedHours: number;
  complianceDueDate: string;
  notes: string | null;
  costCenter: string | null;
  reqId: string | null;
  payDetails: PayDetails;
  billingDetails: BillingDetails;
};
