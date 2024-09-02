import { SetStateAction } from "react";
import { SelectOption } from "./FacilityTypes";
import {
  EmergencyContactDetailType,
  FederalQuestionType,
  ProfessionalAdditionalDetailsType,
} from "./ProfessionalAuth";
import { ProfessionalBackgroundQuesionsType } from "./ProfessionalDetails";

interface DocumentMaster {
  Id: number;
  Type: string;
}

interface ApprovedByUser {
  Id: number;
  FirstName: string;
  LastName: string;
}

export interface JobComplianceDocument {
  Id: number;
  ExpiryDate: string | null;
  EffectiveDate: string | null;
  CreatedOn: string;
  IsApproved: boolean | null;
  ApprovedOn: string | null;
  DocumentMaster: DocumentMaster;
  ApprovedByUser: ApprovedByUser | null;
}

export interface JobComplianceRejectedDocument {
  Id: number;
  RejectedOn: string;
  DocumentMaster: DocumentMaster;
  RejectedByUser: ApprovedByUser;
}

interface AdditionalDocument {
  Id: number;
  CreatedOn: string;
  DocumentMaster: DocumentMaster;
}

export type ProfessionalCoreComplianceDocumentType = {
  Id: number;
  DocumentMaster: DocumentMaster;
};

export interface ProfessionalDocument {
  Id: number;
  FileName: string;
  CreatedOn: string;
  UpdatedOn: string | null;
  JobComplianceDocuments: JobComplianceDocument[];
  JobComplianceRejectedDocuments: JobComplianceRejectedDocument[];
  AdditionalDocument: AdditionalDocument;
  ProfessionalCoreComplianceDocument: ProfessionalCoreComplianceDocumentType | null;
}

export type AdditionalEmergencyContactModalType = {
  isOpen: boolean;
  toggle: () => void;
  state: any;
  dispatch: React.Dispatch<any>;
  setFetch: React.Dispatch<SetStateAction<boolean>>;
};

export type DiscoveredGig = {
  Id: number;
  Option: string;
};

export type GigListType = {
  Id: number;
  Ssn: string | null;
  Dob: string | null;
  ReferralId: number | null;
  DiscoveredGigOther: string | null;
  DiscoveredGig: DiscoveredGig | null;
};

export type AdditionalDetailsState = {
  selectedState: SelectOption | null;
  selectedCity: SelectOption | null;
  selectedZip: SelectOption | null;
  states: { Id: number; State: string; Code: string }[];
  cities: { Id: number; City: string }[];
  zip: { Id: number; ZipCode: string }[];
  bgQuestions: ProfessionalBackgroundQuesionsType[];
  additionalDetails: ProfessionalAdditionalDetailsType[];
  federalQuestions: FederalQuestionType[];
  emergencyContactList: EmergencyContactDetailType[];
  gigList: GigListType;
};

export type AdminEmergencyContactType = {
  Id: number;
  Name: string;
  Email: string;
  Phone: string;
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

export type AdditionalEmergencyContactCardProps = {
  Id: number;
  Name: string;
  Email: string;
  Phone: string;
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
  setFetch: React.Dispatch<SetStateAction<boolean>>;
  state: any;
  dispatch: React.Dispatch<SetStateAction<any>>;
  data: AdminEmergencyContactType[];
};

export type EditAdditionalEmergencyContactModalProps = {
  Id: number;
  isOpen: boolean;
  toggle: () => void;
  state: any;
  dispatch: React.Dispatch<any>;
  setFetch: React.Dispatch<SetStateAction<boolean>>;
  data: AdminEmergencyContactType;
};

export type BackgroundQuestionsProps = {
  state: Pick<AdditionalDetailsState, "bgQuestions">;
};

export type GigQuestionsProps = {
  state: Pick<AdditionalDetailsState, "gigList">;
};

export type FederalAdminQuestionsProps = {
  state: Pick<AdditionalDetailsState, "federalQuestions">;
};

export type PersonalDetailsType = {
  dob: string | null;
  ssn: string | null;
};

export type PersonalDetailsModalProps = {
  isOpen: boolean;
  toggle: () => void;
  setFetch: React.Dispatch<SetStateAction<boolean>>;
  state: Pick<AdditionalDetailsState, "gigList">;
};
