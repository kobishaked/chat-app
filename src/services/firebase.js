import React from 'react';
import * as firebase from 'firebase'; 
 
 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyA95_7roA6CswCu8qIp6u3Vms3FZC2hXX0",
    authDomain: "chat-app-60c6c.firebaseapp.com",
    databaseURL: "https://chat-app-60c6c.firebaseio.com",
    projectId: "chat-app-60c6c",
    storageBucket: "chat-app-60c6c.appspot.com",
    messagingSenderId: "366979196579",
    appId: "1:366979196579:web:961e75b1725e9ad2ddc116"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;