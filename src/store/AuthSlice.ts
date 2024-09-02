import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Allows } from "../types/AuthTypes";
import { AuthSlice } from "../types/Store";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        allows: [],
    },
    reducers: {
        setAllows: (state: AuthSlice, action: PayloadAction<Allows[]>) => {
            state.allows = action.payload;
        }
    },
});

export const {
    setAllows,
} = authSlice.actions;

export default authSlice.reducer;
