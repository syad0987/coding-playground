import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBS5-6p-FuagNjYmr2iRVu0pRevydyYpnU",
  authDomain: "collaborating-codeplayground.firebaseapp.com",
  projectId: "collaborating-codeplayground",
  storageBucket: "collaborating-codeplayground.firebasestorage.app",
  messagingSenderId: "366545682554",
  appId: "1:366545682554:web:7f82ea00553ab2b552bbc3",
  measurementId: "G-S660BE7D0E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
