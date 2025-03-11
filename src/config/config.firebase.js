import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDvLsN81lcjqk3-1c5116bZMEsnBL3cmh4",
  authDomain: "delta-cosmos-452118-c0.firebaseapp.com",
  projectId: "delta-cosmos-452118-c0",
  storageBucket: "delta-cosmos-452118-c0.firebasestorage.app",
  messagingSenderId: "785464740296",
  appId: "1:785464740296:web:2b62e953535204908218fd",
  measurementId: "G-YEQLYDJFHL"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services Firebase
// Note: getAnalytics() peut ne fonctionner que dans un environnement navigateur
const analytics = import.meta.env.PROD ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);

// Exporter les services
export { analytics, auth, db, functions, storage };
export default app;