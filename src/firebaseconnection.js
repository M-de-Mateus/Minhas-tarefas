import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "YOURAPIKEY",
    authDomain: "YOURDOMAIN.firebaseapp.com",
    projectId: "YOURPROJECTID",
    storageBucket: "YOURSTORAGEBUCKET.appspot.com",
    messagingSenderId: "0000000",
    appId: "YOUAPPID",
    measurementId: "XXXXXXXXXXX"
  };

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp)

export { db, auth };
