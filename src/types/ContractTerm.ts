export type ContractTermList = {
  Id: number;
  ActivationStatus: boolean;
  CreatedOn: string;
};

export type PaymentTerm = {
  Id: number;
  Term: string;
};

export type Contract = {
  // contractId: string;
  contactName: string;
  contactNumber: string;
  paymentTermId: number;
  workWeek: string;
  superAdminFee: number;
  nonBillableOrientation: string;
  holidayMultiplier: number;
  includedHolidays: string;
  holidayBillingRules: string;
  overtimeMultiplier: number;
  overtimeThreshold: number;
  onCallRate: number;
  doubletimeMultiplier: number;
  callBackMultiplier: number;
  timeRoundingGuidelines: string;
  specialBillingDetails: string;
  gauranteedHrs: number;
  timekeepingProcess: string;
  missedPunchPayrollProcess: string;
  costCenters: string;
  kronosTimeCodes: string;
};
export type ContractData = {
  ContractId: string;
  ContactName: string;
  ContactNumber: string;
  WorkWeek: string;
  SuperAdminFee: number;
  NonBillableOrientation: string;
  HolidayMultiplier: number;
  IncludedHolidays: string;
  CallBackMultiplier: number;
  CostCenters: string;
  GauranteedHrs: number;
  HolidayBillingRules: string;
  KronosTimeCodes: string;
  MissedPunchPayrollProcess: string;
  OnCallRate: number;
  DoubletimeMultiplier: number;
  OvertimeMultiplier: number;
  OvertimeThreshold: number;
  SpecialBillingDetails: string;
  TimekeepingProcess: string;
  TimeRoundingGuidelines: string;
  ActivationStatus: boolean;
  PaymentTerm: PaymentTerm;
  ContractDocuments: ContractDocument[];
};
export type ContractDocument = {
  Id: number;
  FileName: string;
  Notes: string;
  CreatedOn: string;
};
export interface AddContractProps {
  switchToNextTab: () => void;
  onContractIdChange: (Id: number) => void;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  editingContractId: number | null;
  // setFormComplete: React.Dispatch<React.SetStateAction<boolean>>;
}
export type DownloadedFile = { name: string; url: string };

export type ContractTermTableData = {
  Id: number;
  FileName: string;
  Notes: string;
  CreatedOn: string;
  document: File | undefined;
};
export type ContractTermData = {
  contractDocuments: File | undefined;
  notes: string;
};
export interface UploadContractProps {
  contractIdprop?: number;
  switchToContractInfoTab: () => void;
}
export type ViewContractProps = {
  Id: number | undefined;
  isOpen: boolean;
  toggle: () => void;
};
