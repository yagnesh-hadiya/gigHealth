import { MessagePayload } from "firebase/messaging";

export type FirebaseMessageCallback = (payload: MessagePayload) => void;