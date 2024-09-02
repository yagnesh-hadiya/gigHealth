import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserStoreSlice } from "../types/Store";
import { userInitialValues } from "../types/StoreInitialTypes";
import { RootState } from "./index";

const userSlice = createSlice({
  name: "user",
  initialState: userInitialValues,
  reducers: {
    setUserName: (state: UserStoreSlice, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setUserEmail: (state: UserStoreSlice, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
});

export const { setUserName, setUserEmail } = userSlice.actions;

export const getName = (state: RootState) => state.user.userName;
export const getEmail = (state: RootState) => state.user.email;

export default userSlice.reducer;
