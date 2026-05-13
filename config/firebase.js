import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFDOssWpC0tZtCyzn15Bxey9tfXfwIIuQ",
  authDomain: "campus-marketplace-17774.firebaseapp.com",
  projectId: "campus-marketplace-17774",
  storageBucket: "campus-marketplace-17774.firebasestorage.app",
  messagingSenderId: "453720400721",
  appId: "1:453720400721:web:7bf7d39c523c36694e2970",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };
