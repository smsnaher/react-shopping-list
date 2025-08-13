import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// Replace these environment variables with your actual Firebase config values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBuNxnQqG8DDApF2K95vMM-Z9_3-ASWcL4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ratna-shopping-list.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ratna-shopping-list",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ratna-shopping-list.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "488182871191",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:488182871191:web:51e44ef6182dd3908f25d2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-PHLKP96YPD"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBuNxnQqG8DDApF2K95vMM-Z9_3-ASWcL4",
//   authDomain: "ratna-shopping-list.firebaseapp.com",
//   projectId: "ratna-shopping-list",
//   storageBucket: "ratna-shopping-list.firebasestorage.app",
//   messagingSenderId: "488182871191",
//   appId: "1:488182871191:web:51e44ef6182dd3908f25d2",
//   measurementId: "G-PHLKP96YPD"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;


// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase