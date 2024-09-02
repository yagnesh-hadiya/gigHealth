import { SetStateAction } from "react";
import { SelectOption } from "./FacilityTypes";
import { ProfessionalBackgroundQuesionsType } from "./ProfessionalDetails";
import { TalentJobDetailsType } from "./TalentJobs";

export type ProfessionalRegisterFormType = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  password: string;
  confirmPassword: string;
};

export type ProfessionalRegisterFormState = {
  selectedState: SelectOption | null;
  selectedCity: SelectOption | null;
  selectedZip: SelectOption | null;
  selectedProfession: SelectOption | null;
  selectedSpecialities: { Id: number; Speciality: string } | null;
  states: { Id: number; State: string; Code: string }[];
  cities: { Id: number; City: string }[];
  zip: { Id: number; ZipCode: string }[];
  profession: { Id: number; Category: string }[];
  speciality: { Id: number; Speciality: string }[];
  preferredLocations: SelectOption | null;
  isChecked: boolean;
};

export enum ActionType {
  SetSelectedState = "SetSelectedState",
  SetState = "SetState",
  SetSelectedCity = "SetSelectedCity",
  SetCities = "SetCities",
  SetSelectedZip = "SetSelectedZip",
  SetZip = "SetZip",
  SetSelectedProfession = "SetSelectedProfession",
  SetProfession = "SetProfession",
  SetSpeciality = "SetSpeciality",
  SetSelectedSpecialities = "SetSelectedSpecialities",
  SetPreferredLocations = "SetPreferredLocations",
  SetIsChecked = "SetIsChecked",
  SelectedQuestion = "SelectedQuestion",
  SetBackgroundQuestion = "SetBackgroundQuestion",
  SetDocuments = "SetDocuments",
  SetUploadedDocuments = "SetUploadedDocuments",
  SetAdditionalDetails = "SetAdditionalDetails",
  SetGenderList = "SetGenderList",
  SetFederalQuestion = "SetFederalQuestion",
  SetEmergencyContactList = "SetEmergencyContactList",
  SetTalentJobDetails = "SetTalentJobDetails",
  SetRequiredDocsDetails = "SetRequiredDocsDetails",
  SetGigList = "SetGigList",
}

export type QuestionAnswerType = {
  Id: number;
  Question: string;
  BackgroundQuestionAnswer: {
    Answer: boolean | null;
  };
};

export type ProfessionalDocumentsType = {
  Id: number;
  Type: string;
  Description: string;
};

export type ProfessionalUploadedDocsType = {
  Id: number;
  DocumentMaster: {
    Id: number;
    Type: string;
    Description: string;
  };
  ProfessionalDocument: {
    Id: number;
    FileName: string;
    CreatedOn: string;
    UpdatedOn: string | null;
  };
};

export type ProfessionalAdditionalDetailsType = {
  Id: number;
  Ssn: string;
  Dob: string;
  DiscoveredGigId: number;
  ReferralId: number | null;
  DiscoveredGigOther: string | null;
  UploadedSignature: boolean;
  DiscoveredGig: {
    Id: number;
    Option: string;
  };
  signatureUrl: string;
};

export type FederalQuestionType = {
  Id: number;
  Question: string;
  FederalQuestionOptions: [
    {
      Id: number;
      Option: string;
      Order: number;
    }
  ];
  FederalQuestionAnswer: {
    OptionId: number;
  };
};

export type EmergencyContactDetailType = {
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
    ZipCode: number;
  };
};

export type ContactCardProps = {
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
    ZipCode: number;
  };
  state: any;
  dispatch: React.Dispatch<any>;
  index: number;
  setFetch: React.Dispatch<SetStateAction<boolean>>;
};

export type GenderListType = {
  Id: number;
  Gender: string;
};

export type ProfessionalMyProfileState = {
  selectedState: SelectOption | null;
  selectedCity: SelectOption | null;
  selectedZip: SelectOption | null;
  states: { Id: number; State: string; Code: string }[];
  cities: { Id: number; City: string }[];
  zip: { Id: number; ZipCode: string }[];
  selectedQuestion: QuestionAnswerType | null;
  bgQuestions: ProfessionalBackgroundQuesionsType[];
  documents: ProfessionalDocumentsType[];
  uploadedDocuments: ProfessionalUploadedDocsType[];
  additionalDetails: ProfessionalAdditionalDetailsType[];
  gendersList: GenderListType[];
  federalQuestions: FederalQuestionType[];
  emergencyContactList: EmergencyContactDetailType[];
  talentJobDetailsList: TalentJobDetailsType[];
  requiredDocsList: RequiredDocs;
};

export type CompDocument = {
  Id: number;
  Priority: number;
  DocumentMaster: {
    Id: number;
    Type: string;
    CoreCompDocuments: {
      Id: number;
    };
  };
  DocumentCategory: {
    Id: number;
    Category: string;
  };
};

export type CompChecklist = {
  Id: number;
  Name: string;
  CompDocuments: CompDocument[];
};

export type RequiredDocs = {
  Id: number;
  CompChecklist: CompChecklist;
};

export type ProfessionalProfilePercentType = {
  workHistory: number | null;
  education: number | null;
  references: number | null;
  professionalInformation: number | null;
  backgroundQuestions: number | null;
  additionalDetails: number | null;
};

export type ProfessionalWorkHistoryFileType = {
  profilePercent: ProfessionalProfilePercentType | undefined;
  setProfilePercent: React.Dispatch<
    React.SetStateAction<ProfessionalProfilePercentType | undefined>
  >;
};

export type ProfessionalAdditionalDetailsPropsType = {
  ssn: string;
  referral?: string | number;
  other?: string;
};

export type AdditionalDetailsType = {
  Id: number;
  Option: string;
};
