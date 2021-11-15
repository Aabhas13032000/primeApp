importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js');

firebase.initializeApp({
    messagingSenderId: "966900184552",
});

const messaging=firebase.messaging();

messaging.setBackgroundMessagingHandler(function (payload){
    console.log(payload);
})
