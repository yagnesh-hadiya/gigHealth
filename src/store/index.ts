import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./TokenSlice";
import authReducer from "./AuthSlice";
import userReducer from "./UserSlice";
import notesReducer from "./NotesSlice";
import professionalDetailsReducer from "./ProfessionalDetailsSlice";
import professionalAuthReducer from "./ProfessionalAuthStore";

const store = configureStore({
  reducer: {
    token: tokenReducer,
    auth: authReducer,
    user: userReducer,
    notes: notesReducer,
    professionalDetails: professionalDetailsReducer,
    professionalAuth: professionalAuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
