import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Note, notesInitialState } from "../types/StoreInitialTypes";
import { RootState } from ".";

const notesSlice = createSlice({
    name: "notes",
    initialState: notesInitialState,
    reducers: {
        setNotes: (state, action: PayloadAction<Note[]>) => {
            const newNotes = action.payload;

            newNotes.forEach((note) => {
                if (!state.notes.some((item) => item.Id === note.Id)) {
                    state.notes.push(note);
                }
            })
        }
    }
});

export const {
    setNotes
} = notesSlice.actions

export const getNotes = (state: RootState) => state.notes.notes;

export default notesSlice.reducer;