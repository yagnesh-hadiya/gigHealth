import { SetStateAction } from "react";
import { BooleanSelectOption, SelectOption } from "./FacilityTypes";
import { WorkHistoryType } from "./ProfessionalDetails";

export type WorkHistoryModalProps = {
  isOpen: boolean;
  toggle: () => void;
  fetch: () => void;
};
export type EditWorkHistoryModalProps = {
  id: number;
  workHistory: WorkHistoryType;
  isOpen: boolean;
  toggle: () => void;
  fetch: () => void;
};

export type WorkHistoryModalType = {
  startDate: string;
  endDate: string | null;
  isCurrentlyWorking: boolean;
  facilityName: string;
  stateId: number;
  facilityType: string;
  professionId: number;
  specialityId: number;
  nurseToPatientRatio: string;
  facilityBeds: string;
  bedsInUnit: string;
  isTeachingFacility: boolean;
  isMagnetFacility: boolean;
  isTraumaFacility: boolean;
  traumaLevelId?: number | null;
  additionalInfo: string | null;
  positionHeld: string;
  agencyName: string | null;
  isChargeExperience: boolean;
  isChartingSystem: boolean;
  shiftId: string;
  reasonForLeaving: string;
  categoryProfession: string;
};

export type WorkHistoryModalDropdown = {
  selectedState: SelectOption | null;
  selectedProfession: any;
  selectedSpeciality: SelectOption | null;
  selectedTrauma: SelectOption | null;
  selectedChart: BooleanSelectOption | null;
  selectedShift: SelectOption | null;
  selectedChargeExperience: BooleanSelectOption | null;
};

export type WorkHistoryModalRadiobtn = {
  selectedAttending: true | false;
  selectedTeachingFacility: true | false | string;
  selectedMagnetFacility: true | false | string;
  selectedTraumaFacility: true | false | string;
};

export type ProfessionalWorkHistoryModalRadiobtn = {
  selectedAttending: true | false;
  selectedTeachingFacility: true | false;
  selectedMagnetFacility: true | false;
  selectedTraumaFacility: true | false;
};

export type ProfessionalCreateReferenceProps = {
  isOpen: boolean;
  toggle: () => void;
  fetch: () => void;
  setFetchDetails?: React.Dispatch<SetStateAction<boolean>>;
};

export type ProfessionalCreateReferenceCard = {
  fetch: () => void;
  index: number;
};
