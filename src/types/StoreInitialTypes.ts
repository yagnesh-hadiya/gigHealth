import { ActivityCategory, ActivityType, User } from "./NotesTypes";
import { ProfessionalProfilePercentType } from "./ProfessionalAuth";
import { WorkHistoryType } from "./ProfessionalDetails";

export type userInitialTypes = {
  userName: string;
  email: string;
};

export type State = {
  Id: number;
  State: string;
};

export type City = {
  Id: number;
  City: string;
};

export type ZipCode = {
  Id: number;
  ZipCode: string;
};

export type JobProfession = {
  Id: number;
  Profession: string;
};

export type JobSpeciality = {
  Id: number;
  Speciality: string;
};

export type ProfessionalStatus = {
  Id: number;
  Status: string;
};

export type PreferredLocation = {
  StateId: number;
  State: {
    State: string;
  };
};

export type Note = {
  Id: number;
  Content: string;
  CreatedOn: string;
  FromEmail: string | null;
  ToEmail: string | null;
  Subject: string | null;
  FromMobile: string | null;
  ToMobile: string | null;
  ActivityType: ActivityType;
  ActivityCategory: ActivityCategory | null;
  FromUser: User;
  ToUser: User | null;
};

export type ProgramManagerType = {
  Id: number;
  FirstName: string;
  LastName: string;
};

export type EmploymentExpertType = {
  Id: number;
  FirstName: string;
  LastName: string;
};

export type ProfessionalProgramManager = {
  Id: Number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
};

export type ProfessionalEmploymentExpert = {
  Id: Number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
};

export type ProfessionalDetails = {
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Address: string;
  Experience: number;
  ActivationStatus: boolean;
  State: State;
  City: City;
  ZipCode: ZipCode;
  ProgramManager: ProgramManagerType;
  EmploymentExpert: EmploymentExpertType;
  JobProfession: JobProfession;
  JobSpeciality: JobSpeciality;
  ProfessionalStatus: ProfessionalStatus;
  PreferredLocations: PreferredLocation[];
  ProfileImage: string;
  Ssn: string;
  Dob: string;
  QuickNotes: string | null;
  profilePercentage: ProfessionalProfilePercentType;
};

export type authDetails = {
  image?: string;
  profilePercentage: ProfessionalProfilePercentType;
  ActivationStatus: boolean;
  Address: string;
  City: City;
  Dob: null | string;
  Email: string;
  EmploymentExpert: null | ProfessionalEmploymentExpert;
  Experience: number;
  FirstName: string;
  Gender: null | { Id: number; Gender: string };
  Id: number;
  JobProfession: JobProfession;
  JobSpeciality: JobSpeciality;
  LastName: string;
  Phone: string;
  PreferredLocations: PreferredLocation[];
  ProfessionalStatus: ProfessionalStatus;
  ProgramManager: null | ProfessionalProgramManager;
  QuickNotes: null | string;
  Ssn: null | string;
  State: State;
  UploadedProfilePic: boolean;
  ZipCode: ZipCode;
};

export type LicenseList = {
  Id: number;
  Name: string;
  LicenseNumber: string;
  Expiry: Date;
  IsActiveCompact: boolean;
  State: State;
};

export type CertificationList = {
  Id: number;
  Name: string;
  Expiry: Date | string;
};

export type EducationList = {
  Id: number;
  Degree: string;
  School: string;
  Location: string;
  DateStarted: string;
  GraduationDate: Date | string;
  IsCurrentlyAttending: boolean;
};

export type ProfessionList = {
  Id: number;
  Profession: string;
};

export type SpecialityList = {
  Id: number;
  Speciality: string;
};

export type ShiftList = {
  Id: number;
  Shift: string;
};

export type LocationList = {
  Id: number;
  State: string;
  Code: string;
};

export type TraumaList = {
  Id: number;
  Level: string;
};

export type NotesState = {
  notes: Note[];
};

export type professionalDetailsState = {
  headerDetails: ProfessionalDetails[];
  professionalStatus: ProfessionalStatus[];
  name: string;
  licenseList: LicenseList[];
  certificationList: CertificationList[];
  educationList: EducationList[];
  profession: ProfessionList[];
  speciality: SpecialityList[];
  trauma: TraumaList[];
  location: LocationList[];
  shift: ShiftList[];
  workHistory: WorkHistoryType[];
  fetchDetails: boolean;
};

export type professionalAuthState = {
  authDetails: authDetails[];
  isLoggedIn: boolean;
  profilePercentage: ProfessionalProfilePercentType | null;
  facilityImage: string;
  viewPage: string;
};

export const userInitialValues: userInitialTypes = {
  userName: "",
  email: "",
};

export const notesInitialState: NotesState = {
  notes: [],
};

export const professionalDetailsState: professionalDetailsState = {
  headerDetails: [],
  professionalStatus: [],
  name: "",
  licenseList: [],
  certificationList: [],
  educationList: [],
  profession: [],
  speciality: [],
  trauma: [],
  location: [],
  shift: [],
  workHistory: [],
  fetchDetails: false,
};

export const professionalAuthState: professionalAuthState = {
  authDetails: [],
  isLoggedIn: localStorage.getItem("isLoggedIn") === "1",
  profilePercentage: null,
  facilityImage: "",
  viewPage: "",
};
