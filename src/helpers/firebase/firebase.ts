import { FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, Unsubscribe, MessagePayload } from "firebase/messaging";
import { onMessage, getToken, deleteToken } from "firebase/messaging";
import { FirebaseMessageCallback } from "../../types/FirebaseTypes";
import { addDeviceToken } from "../../services/FirebaseServices";
import firebaseConfig from "./firebaseConfig.json";
import { vapidKey } from "../config";

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const permission: NotificationPermission =
      await Notification.requestPermission();
    if (permission === "granted") {
      const token: string = await getToken(messaging, { vapidKey: vapidKey });
      if (token) {
        await addDeviceToken(token);
      }
    }
  } catch (error) {
    console.error("An error occurred while retrieving token.", error);
  }
};

export const cleanUpFirebase = async () => {
  try {
    await deleteToken(messaging);
  } catch (error) {
    console.error("An error occurred while cleaning up firebase ", error);
  }
};

export const onFirebaseMessage = (cb: FirebaseMessageCallback): Unsubscribe => {
  return onMessage(messaging, (payload: MessagePayload) => {
    cb?.(payload);
  });
};
