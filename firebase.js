// Import the functions you need from the SDKs you need
import { initializeApp ,getApps,getApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "leaflets-app-v2-220310.firebaseapp.com",
  projectId: "leaflets-app-v2-220310",
  storageBucket: "leaflets-app-v2-220310.appspot.com",
  messagingSenderId: "315074606181",
  appId: "1:315074606181:web:434eda8822c6ed446f028c",
  measurementId: "G-L1K6XXS4JJ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig):getApp();
// const analytics = getAnalytics(app);
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
