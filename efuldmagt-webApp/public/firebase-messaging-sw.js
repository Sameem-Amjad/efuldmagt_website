// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Must be the same Firebase project as VITE_APP_* in .env and the backend's
// service account, or push tokens are issued by a project the backend can't send to.
const firebaseConfig = {
  apiKey: "AIzaSyD4B7Vc5CF0GonXxfI-_ND5WHRLXvRlNR4",
  authDomain: "efuldmagt-1a602.firebaseapp.com",
  projectId: "efuldmagt-1a602",
  storageBucket: "efuldmagt-1a602.firebasestorage.app",
  messagingSenderId: "38682304373",
  appId: "1:38682304373:web:19f158e7b829e8071efd3c",
  measurementId: "G-J1H5GBHRWF",
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
