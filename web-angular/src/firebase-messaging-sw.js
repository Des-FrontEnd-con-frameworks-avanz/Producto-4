importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBGNW2mjZuBuoA2lmoiVPXBKwWK6ln7eAw",
    authDomain: "equipobasket-database.firebaseapp.com",
    databaseURL: "https://equipobasket-database-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "equipobasket-database",
    storageBucket: "equipobasket-database.firebasestorage.app",
    messagingSenderId: "213459839335",
    appId: "1:213459839335:web:224a20c11e8315908167c2"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Mensaje recibido de fondo ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/favicon.ico'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});