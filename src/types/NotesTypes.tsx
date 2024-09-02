import { SetStateAction } from "react";
import { Note } from "./StoreInitialTypes";

export interface EmailModalProps {
  isOpen: boolean;
  toggle: () => void;
  facilityId: string | undefined;
  pageRef: { current: number };
  setFetchData: React.Dispatch<SetStateAction<boolean>>;
}
export interface MessageModalProps {
  isOpen: boolean;
  toggle: () => void;
}
export interface ActivityModalProps {
  isOpen: boolean;
  toggle: () => void;
  facilityId: string | undefined;
  pageRef: { current: number };
  setFetchData: React.Dispatch<SetStateAction<boolean>>;
}
export type NoteCardProp = {
  facId: number;
  setFetchData: React.Dispatch<SetStateAction<boolean>>;
  pageRef: { current: number };
  data: Note;
};

export type ActivityModalType = {
  notes: string;
};

export type CategoryType = {
  Id: number;
  Category: string;
};

export type EmailModalType = {
  toEmail: string;
  subject: string;
};

export type NotesActivitiesType = {
  Id: number;
  Type: string;
};

export type ActivityType = {
  Id: number;
  Type: string;
};

export type ActivityCategory = {
  Id: number;
  Category: string;
};

export type User = {
  Id: number;
  FirstName: string;
  LastName: string;
};

export type NotesActivityModalProps = {
  isOpen: boolean;
  toggle: () => void;
  facilityId: number;
  editData: Note;
  readOnly: boolean;
  fetchNotes: () => void;
};

export type NotesEmailModalProps = {
  isOpen: boolean;
  toggle: () => void;
  facilityId: number;
  editData: Note;
  readOnly: boolean;
};

export type NotesMessageModalProps = {
  isOpen: boolean;
  toggle: () => void;
  facilityId: number;
  editData: Note;
  readOnly: boolean;
};
