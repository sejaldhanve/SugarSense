import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app'; // <-- ADDED getApps, getApp
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDOd2DspfwaMyuOcqY21cEAqYwSPyhF5DI",
  authDomain: "diazone-a695e.firebaseapp.com",
  databaseURL: "https://diazone-a695e-default-rtdb.firebaseio.com",
  projectId: "diazone-a695e",
  storageBucket: "diazone-a695e.appspot.com",
  messagingSenderId: "609942252503",
  appId: "1:609942252503:web:80ca08f9db8eb96f113992",
  measurementId: "G-BKC4T9SYPV"
};

// ----------------------------------------------------
// CRITICAL FIX: Add the initialization guard
// ----------------------------------------------------
const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp(); // If apps exist, get the default app instance

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };