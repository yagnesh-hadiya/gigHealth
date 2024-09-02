import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
  name: "token",
  initialState: {
    accessToken: null,
    refreshToken: null,
    authenticated: false,
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      state.authenticated = true;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.authenticated = action.payload;
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.authenticated = false;
    },
  },
});

export const {
  setAccessToken,
  setRefreshToken,
  setIsAuthenticated,
  clearTokens,
} = tokenSlice.actions;

export default tokenSlice.reducer;
