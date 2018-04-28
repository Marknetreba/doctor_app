// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require ('electron');
const axios = require('axios');
const admin = require("firebase-admin");
const firebase = require("firebase");
const topics = require('topics');

const config = {
    apiKey: "AIzaSyA6dkZsqREfubEGyxN4yAEyf2P6np_RP6Y",
    authDomain: "infoterminal-7973d.firebaseapp.com",
    databaseURL: "https://infoterminal-7973d.firebaseio.com",
    projectId: "infoterminal-7973d",
    storageBucket: "",
    messagingSenderId: "498398049541"
};
firebase.initializeApp(config);


admin.initializeApp({
    credential: admin.credential.cert("infoterminal-admin-key.json"),
    databaseURL: "https://infoterminal-7973d.firebaseio.com"
});

const {
  START_NOTIFICATION_SERVICE,
  NOTIFICATION_SERVICE_STARTED,
  NOTIFICATION_SERVICE_ERROR,
  NOTIFICATION_RECEIVED,
  TOKEN_UPDATED,
} = require ('electron-push-receiver/src/constants');

// Listen for service successfully started
ipcRenderer.on(NOTIFICATION_SERVICE_STARTED, (_, token) => {
  console.log('Service started -> ', token);

    // admin.messaging().subscribeToTopic(token, "news").then(function (response) {
    //         console.log("Successfully subscribed to topic:", response);
    //     }).catch(function (error) {
    //         console.log("Error subscribing to topic:", error);
    //     });

    const auth = "AAAAdArWtQU:APA91bEBGdgYLIUuX0_9H7MITtswX8Eu4YYMfNDUoVMfInHz0ueCtIL1JBtPRRbzievC3JhLApscOsx7zhpSNkxkJ5He8QjnXJFB5MQ6tQuhjv2zW6jUqhmBLuT7QYs0brG_73vJt5iT";

    axios.post('https://iid.googleapis.com/iid/v1/'+token+'/rel/topics/55',{}, {
      headers: {
          "Content-Type" : "application/json",
          "Authorization" : "key="+auth
      }
    }).then(function (response) {
        console.log(response)
    })
});

// Handle notification errors
ipcRenderer.on(NOTIFICATION_SERVICE_ERROR, (_, error) => {
  console.log('notification error', error)
});

// Send FCM token to backend
ipcRenderer.on(TOKEN_UPDATED, (_, token) => {
  console.log('token updated', token)
});

// Display notification
ipcRenderer.on(NOTIFICATION_RECEIVED, (_, serverNotificationPayload) => {
  // check to see if payload contains a body string, if it doesn't consider it a silent push
  if (serverNotificationPayload.notification.body){
    // payload has a body, so show it to the user
    console.log('display notification', serverNotificationPayload);
    let myNotification = new Notification(serverNotificationPayload.notification.title, {
      body: serverNotificationPayload.notification.body
    });
    
    myNotification.onclick = () => {
      console.log('Notification clicked')
    }  
  } else {
    // payload has no body, so consider it silent (and just consider the data portion)
    console.log('do something with the key/value pairs in the data', serverNotificationPayload.data)
  }
});

// Start service
const senderId = '498398049541'; // <-- replace with FCM sender ID from FCM web admin under Settings->Cloud Messaging
console.log('starting service and registering a client');
ipcRenderer.send(START_NOTIFICATION_SERVICE, senderId);
