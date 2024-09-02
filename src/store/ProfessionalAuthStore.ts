import { RootState } from ".";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { authDetails, professionalAuthState } from "../types/StoreInitialTypes";
import { ProfessionalProfilePercentType } from "../types/ProfessionalAuth";

const professionalAuthSlice = createSlice({
  name: "professionalAuthSlice",
  initialState: professionalAuthState,
  reducers: {
    setAuthDetails: (state, action: PayloadAction<authDetails[]>) => {
      state.authDetails = action.payload;
    },
    setIsloggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setProfilePercentage: (
      state,
      action: PayloadAction<ProfessionalProfilePercentType>
    ) => {
      state.profilePercentage = action.payload;
    },
    setFacilityImage: (state, action: PayloadAction<string>) => {
      state.facilityImage = action.payload;
    },
    setViewPage: (state, action: PayloadAction<string>) => {
      state.viewPage = action.payload;
    },
  },
});

export const {
  setAuthDetails,
  setIsloggedIn,
  setProfilePercentage,
  setFacilityImage,
  setViewPage,
} = professionalAuthSlice.actions;

export const getAuthDetails = (state: RootState): authDetails[] =>
  state.professionalAuth.authDetails;
export const getIsLoggedIn = (state: RootState): boolean =>
  state.professionalAuth.isLoggedIn;
export const getProfilePercentage = (
  state: RootState
): ProfessionalProfilePercentType | null =>
  state.professionalAuth.profilePercentage;
export const getFacilityImage = (state: RootState): string =>
  state.professionalAuth.facilityImage;
export const getViewPage = (state: RootState): string =>
  state.professionalAuth.viewPage;

export default professionalAuthSlice.reducer;
