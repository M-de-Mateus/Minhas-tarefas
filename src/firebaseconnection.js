import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCTqvabp7uDpMfYM7_3tXTENptNZUqVB6g",
    authDomain: "curso-reactjs-1fb17.firebaseapp.com",
    projectId: "curso-reactjs-1fb17",
    storageBucket: "curso-reactjs-1fb17.appspot.com",
    messagingSenderId: "141547675950",
    appId: "1:141547675950:web:34d1b49ce6791b4195dabf",
    measurementId: "G-LD3YG3FZYX"
  };

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp)

export { db, auth };
