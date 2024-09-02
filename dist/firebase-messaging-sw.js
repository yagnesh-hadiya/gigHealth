importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyC0Qdo6PpJtOrsxW7R0m-iVR9YLsNDGYYk",
  authDomain: "osplabs-966c1.firebaseapp.com",
  projectId: "osplabs-966c1",
  storageBucket: "osplabs-966c1.appspot.com",
  messagingSenderId: "161090588704",
  appId: "1:161090588704:web:1ec09c72f7f37d0115ac45",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const channel = new BroadcastChannel("notificationChannel");
  const notificationTitle = payload?.notification?.title;
  const notificationOptions = {
    body: payload?.notification?.body,
    icon: "/logoround.jpg",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
  channel.postMessage({ action: "notification", payload: payload });
});
