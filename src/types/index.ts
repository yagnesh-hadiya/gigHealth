import { ChangeEvent, ReactNode } from "react";

export type SearchProps = {
  placeholder: string;
  onSearch: (text: string) => void;
};

export type FacilityContextProps = {
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
};

export type FacilityProgramManagerContextProps = {
  programManager: string;
  setProgramManager: React.Dispatch<React.SetStateAction<string>>;
};

export type FacilityContextProviderProps = {
  children: ReactNode;
};

export type CheckboxProps = {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  disabled: boolean;
  className?: string;
  id?: string;
};

export type FacilityActiveComponentProps = {
  activeComponent: string;
  setActiveComponent: React.Dispatch<React.SetStateAction<string>>;
};

export const jobsInitialStateValue = {
  selectedTemplate: null,
  selectedProfession: null,
  selectedSpecialities: null,
  selectedContract: null,
  selectedJobStatus: null,
  selectedEmploymentType: null,
  selectedScrub: null,
  selectedShiftStart: null,
  selectedShiftEnd: null,
  selectedChecklist: null,
  selectedComplianceList: null,
  scrub: [],
  profession: [],
  employmentType: [],
  jobStatus: [],
  speciality: [],
  jobTemplate: [],
  contract: [],
  complianceDetails: [],
  complianceList: [],
  featuredJob: false,
  facilityName: "",
  cardDetails: [],
  shiftStartTime: null,
  shiftEndTime: null,
  programManager: "",
  selectedContractStartDate: "",
  documentList: [],
  selectedShiftTime: null,
  shiftTime: [],
  content: "",
  search: "",
  facility: [],
  selectedFacility: null,
  jobId: null,
  activeContract: [],
  postToWebsite: false,
  selectedDaysOnAssignment: null,
  reqIds: [],
  formattedReqId: [],
  states: [],
  selectedState: null,
  filter: 0,
  count: {
    professionCount: false,
    specialityCount: false,
    statesCount: false,
    shfitCount: false,
  },
  activeIndex: null,
};

export type ActiveSidebarMenuProps = {
  activeMenu: string;
  setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
};

export type SelectedActiveMenuProps = {
  selectedMenu: boolean;
  setSelectedMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export type FacilityNameContextProps = {
  facilityName: string;
  setFacilityName: React.Dispatch<React.SetStateAction<string>>;
};

export type LoggedinContextProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};
