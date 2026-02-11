import { useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Auth state:", firebaseUser);
      setUser(firebaseUser);
      setloading(false);
    });
    return () => unsubscribe();
  }, []);
  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("logout failed:", error);
    }
  };
  return { user, login, logout, loading };
};
