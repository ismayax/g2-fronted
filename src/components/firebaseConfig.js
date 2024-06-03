// src/components/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCznBE6lrZygi8cRovE5S3Hxas3PU7T4G8",
  authDomain: "reactfirebasegalilleo.firebaseapp.com",
  projectId: "reactfirebasegalilleo",
  storageBucket: "reactfirebasegalilleo.appspot.com",
  messagingSenderId: "147453531107",
  appId: "1:147453531107:web:15e207fea82068c72746d6",
  measurementId: "G-PM7H9GRF0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase initialized:', app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
