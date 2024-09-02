import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import {
  CertificationList,
  EducationList,
  LicenseList,
  LocationList,
  ProfessionList,
  ProfessionalDetails,
  ProfessionalStatus,
  ShiftList,
  SpecialityList,
  TraumaList,
  professionalDetailsState,
} from "../types/StoreInitialTypes";
import { WorkHistoryType } from "../types/ProfessionalDetails";

const professionalDetailsSlice = createSlice({
  name: "professionalDetails",
  initialState: professionalDetailsState,
  reducers: {
    setHeaderDetails: (state, action: PayloadAction<ProfessionalDetails[]>) => {
      state.headerDetails = action.payload;
    },
    setProfessionalStatus: (state, action: PayloadAction<any>) => {
      state.professionalStatus = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setLicenseList: (state, action: PayloadAction<LicenseList[]>) => {
      const newList = action.payload;
      state.licenseList = newList;
    },
    setCertificationList: (
      state,
      action: PayloadAction<CertificationList[]>
    ) => {
      const newList = action.payload;
      state.certificationList = newList;
    },
    setEducationList: (state, action: PayloadAction<EducationList[]>) => {
      state.educationList = action.payload;
    },
    setProfessionList: (state, action: PayloadAction<ProfessionList[]>) => {
      state.profession = action.payload;
    },
    setSpecialityList: (state, action: PayloadAction<SpecialityList[]>) => {
      state.speciality = action.payload;
    },
    setTraumaList: (state, action: PayloadAction<TraumaList[]>) => {
      state.trauma = action.payload;
    },
    setLocationList: (state, action: PayloadAction<LocationList[]>) => {
      state.location = action.payload;
    },
    setShiftList: (state, action: PayloadAction<ShiftList[]>) => {
      state.shift = action.payload;
    },
    setWorkHistoryList: (state, action: PayloadAction<WorkHistoryType[]>) => {
      state.workHistory = action.payload;
    },
    toggleFetchDetails: (state) => {
      state.fetchDetails = !state.fetchDetails;
    },
  },
});

export const {
  setHeaderDetails,
  setProfessionalStatus,
  setName,
  setLicenseList,
  setCertificationList,
  setEducationList,
  setProfessionList,
  setSpecialityList,
  setTraumaList,
  setLocationList,
  setShiftList,
  setWorkHistoryList,
  toggleFetchDetails,
} = professionalDetailsSlice.actions;

export const getHeaderDetails = (state: RootState): ProfessionalDetails[] =>
  state.professionalDetails.headerDetails;
export const getProfessionalStatuses = (
  state: RootState
): ProfessionalStatus[] => state.professionalDetails.professionalStatus;
export const getName = (state: RootState) => state.professionalDetails.name;
export const getLicensesList = (state: RootState): LicenseList[] =>
  state.professionalDetails.licenseList;
export const getCertificationsList = (state: RootState): CertificationList[] =>
  state.professionalDetails.certificationList;
export const getEducationList = (state: RootState): EducationList[] =>
  state.professionalDetails.educationList;
export const getProfessionList = (state: RootState): ProfessionList[] =>
  state.professionalDetails.profession;
export const getSpecialityList = (state: RootState): SpecialityList[] =>
  state.professionalDetails.speciality;
export const getTraumaList = (state: RootState): TraumaList[] =>
  state.professionalDetails.trauma;
export const getLocationList = (state: RootState): LocationList[] =>
  state.professionalDetails.location;
export const getShiftList = (state: RootState): ShiftList[] =>
  state.professionalDetails.shift;
export const getWorkHistoryList = (state: RootState): WorkHistoryType[] =>
  state.professionalDetails.workHistory;
export const getFetchDetails = (state: RootState): boolean =>
  state.professionalDetails.fetchDetails;

export default professionalDetailsSlice.reducer;
