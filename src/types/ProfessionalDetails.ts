import React, { SetStateAction } from "react";
import { SelectOption } from "./FacilityTypes";
import { LicenseList, State } from "./StoreInitialTypes";
import { ProfessionalProfilePercentType } from "./ProfessionalAuth";

export type ProgramManagerModalProps = {
  isOpen: boolean;
  toggle: () => void;
  professionalId: number;
  selectedProgramManager: SelectOption | null;
  setSelectedProgramManager: React.Dispatch<
    SetStateAction<SelectOption | null>
  >;
};

export type EmploymentExpertModalProps = {
  isOpen: boolean;
  toggle: () => void;
  professionalId: number;
  selectedEmploymentType: SelectOption | null;
  setSelectedEmploymentType: React.Dispatch<
    SetStateAction<SelectOption | null>
  >;
};

export type ProgramManagerType = {
  Id: number;
  FirstName: string;
  LastName: string;
  Role: {
    Id: number;
  };
};

export type EmploymentType = {
  Id: number;
  FirstName: string;
  LastName: string;
  Role: {
    Id: number;
  };
};

export type LicenseModalProps = {
  isOpen: boolean;
  toggle: () => void;
  setFetchData: React.Dispatch<React.SetStateAction<boolean>>;
};

export type LicenseModalType = {
  name: string;
  licenseNumber: string;
};

export type LicenseCardProps = {
  setFetchData: React.Dispatch<React.SetStateAction<boolean>>;
  Id: number;
  Name: string;
  LicenseNumber: string;
  IsActiveCompact: boolean;
  Expiry: Date;
  State: State;
};

export type LicenseEditModalType = {
  isOpen: boolean;
  toggle: () => void;
  setFetchData: React.Dispatch<React.SetStateAction<boolean>>;
  data: LicenseList;
  readOnly: boolean;
};

export type WorkHistoryType = {
  fetch?: () => void;
  setFetchDetails?: React.Dispatch<SetStateAction<boolean>>;
  image?: string;
  profilePercentage?: ProfessionalProfilePercentType;
  index?: number;
  Id: number;
  StartDate: string;
  EndDate: string;
  FacilityType: string;
  IsCurrentlyWorking: boolean;
  FacilityName: string;
  NurseToPatientRatio: string;
  IsTeachingFacility: boolean;
  IsMagnetFacility: boolean;
  IsTraumaFacility: boolean;
  AdditionalInfo: string | null;
  PositionHeld: string | null;
  AgencyName: string | null;
  IsChargeExperience: boolean | null;
  IsChartingSystem: boolean | null;
  ReasonForLeaving: string | null;
  FacilityBeds: number;
  BedsInUnit: number;
  State: {
    Id: number;
    State: string;
  };
  JobProfession: {
    Id: number;
    Profession: string;
  };
  JobSpeciality: {
    Id: number;
    Speciality: string;
  };
  TraumaLevel: {
    Id: number;
    Level: string;
  };
  JobShift: {
    Id: number;
    Shift: string;
  };
};

export type ProfessionalHeaderDataProps = {
  imageLoading: boolean;
  imageURL: string;
  selectedProgramManager: SelectOption | null;
  setSelectedProgramManager: React.Dispatch<
    SetStateAction<{ value: number; label: string } | null>
  >;
  selectedEmploymentType: SelectOption | null;
  setSelectedEmploymentType: React.Dispatch<
    SetStateAction<{ value: number; label: string } | null>
  >;
};

export type ProfessionalBackgroundQuesionsType = {
  Id: number;
  Question: string;
  BackgroundQuestionAnswer: {
    Answer: boolean | null;
  };
};

export type AdditionalDocumentsProps = {
  state: any;
  fetch: () => Promise<void>;
};

export type ProfileInformationCardProps = {
  state?: any;
  fetchDetails?: boolean;
  setFetchDetails?: React.Dispatch<SetStateAction<boolean>>;
};

export type questionAnswerType = {
  questionId: number;
  answer: boolean | null;
};
