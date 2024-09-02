import { SetStateAction } from "react";

export type FederalQuestionsProps = {
  id: string;
  text: string;
};

export type EmergencyContactModalProps = {
  toggle: () => void;
  isOpen: boolean;
  state: any;
  dispatch: React.Dispatch<any>;
  setFetch: React.Dispatch<SetStateAction<boolean>>;
};

export type PersonalInformationType = {
  ssn?: string | null;
};

export type CreatePersonalInformationType = {
  ssn?: string | null;
  dob?: string | null;
  genderId?: number | null;
};

export type EmergencyContactType = {
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  stateId: number | null;
  cityId: number | null;
  zipCodeId: number | null;
};

export type CreateEmergencyContactType = {
  name: string;
  email: string;
  phone: string;
  address: string;
  stateId: number;
  cityId: number;
  zipCodeId: number;
};

export type FederalQuestionsCardProps = {
  state: any;
  setFetch: React.Dispatch<SetStateAction<boolean>>;
};
