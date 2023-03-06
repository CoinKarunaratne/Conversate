import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCx_8a5dLZoMFTWqxLHwUF_OkbGNKl8ino",
  authDomain: "conversate-18ca4.firebaseapp.com",
  projectId: "conversate-18ca4",
  storageBucket: "conversate-18ca4.appspot.com",
  messagingSenderId: "190098710967",
  appId: "1:190098710967:web:6d0cc529e94b787e954832",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
