import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5mkMZbHgZHsZvoSNPOMbEZWAfSRsQ6YA",
  authDomain: "studio-3271687317-7deb5.firebaseapp.com",
  projectId: "studio-3271687317-7deb5",
  storageBucket: "studio-3271687317-7deb5.firebasestorage.app",
  messagingSenderId: "858727746326",
  appId: "1:858727746326:web:9cf1e496278243daa85e37"
};

// Initialize Firebase only if config is valid
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, firebaseConfig };
export default app;
