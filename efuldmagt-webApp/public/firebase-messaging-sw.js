// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDlOcc-5sJSUc7O2BjuwqfQ_P5mBKuFvD0",
  authDomain: "efuldmagt-41e99.firebaseapp.com",
  projectId: "efuldmagt-41e99",
  storageBucket: "efuldmagt-41e99.firebasestorage.app",
  messagingSenderId: "369787640219",
  appId: "1:369787640219:web:e18f9cabaf9ac7d730a93e",
  measurementId: "G-0T30C3SBPS",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
