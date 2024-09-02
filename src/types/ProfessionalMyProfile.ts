import { SetStateAction } from "react";
import { authDetails, State } from "./StoreInitialTypes";

export type ProfessionalWorkHistoryModalProps = {
  isOpen: boolean;
  toggle: () => void;
  fetch: () => void;
  setFetchDetails?: React.Dispatch<SetStateAction<boolean>>;
};

export type ProfessionalWorkHistoryParams = {
  startDate: string;
  endDate: string | null;
  isCurrentlyWorking: boolean;
  facilityName: string;
  stateId: number;
  facilityType: string;
  professionId: number;
  specialityId: number;
  nurseToPatientRatio?: string | null;
  facilityBeds: string | number | null;
  bedsInUnit: string | number | null;
  isTeachingFacility?: boolean;
  isMagnetFacility?: boolean;
  isTraumaFacility: boolean;
  traumaLevelId?: number | null;
  additionalInfo?: string | null;
  positionHeld?: string;
  agencyName: string | null;
  isChargeExperience?: boolean | string;
  isChartingSystem?: boolean;
  shiftId?: number | null;
  reasonForLeaving?: string | null;
  Id?: number;
};

export type ProfessionalCreateReferenceType = {
  CanContact: boolean;
  Email: string;
  FacilityName: string;
  Id?: number;
  IsVerified?: boolean;
  Phone: string;
  ReferenceName: string;
  ShowOnSubmission?: boolean;
  Title: string;
  VerifiedByUser?: any;
  VerifiedOn?: any;
  index?: number;
  fetch?: () => void;
  toggle?: () => void;
  setFetchDetails?: React.Dispatch<SetStateAction<boolean>>;
};

export type ProfessionalEducationCardProps = {
  fetch?: () => void;
  toggle?: () => void;
  isOpen?: boolean;
  index?: number;
  setFetchDetails?: React.Dispatch<SetStateAction<boolean>>;
};

export type ProfessionalEducationList = {
  Id: number;
  Degree: string;
  School: string;
  Location: string;
  DateStarted: string;
  GraduationDate: Date | string;
  IsCurrentlyAttending: boolean;
  index?: number;
  fetch?: () => void;
  setFetchDetails?: React.Dispatch<SetStateAction<boolean>>;
};

export type ProfessionalLicenseCardProps = {
  Id: number;
  Name: string;
  LicenseNumber: string;
  Expiry: Date;
  IsActiveCompact: boolean;
  State: State;
  index?: number;
  fetch?: () => void;
  setFetchDetails?: React.Dispatch<SetStateAction<boolean>>;
};

export type ProfessionalLicenseModalProps = {
  fetch?: () => void;
  toggle?: () => void;
  index?: number;
  isOpen: boolean;
  setFetchDetails?: React.Dispatch<SetStateAction<boolean>>;
};

export type ProfessionalCertificationModalProps = {
  isOpen: boolean;
  toggle: () => void;
  fetch: () => void;
  setFetchDetails?: React.Dispatch<SetStateAction<boolean>>;
};

export type ProfessionalCertificationCardProps = {
  index: number;
  fetch: () => Promise<void>;
  Id: number;
  Name: string;
  Expiry: Date | string;
  setFetchDetails?: React.Dispatch<SetStateAction<boolean>>;
};

export type ProfileInformationModalProps = {
  authDetails: authDetails;
  isOpen: boolean;
  toggle: () => void;
  fetch: () => Promise<void>;
};
