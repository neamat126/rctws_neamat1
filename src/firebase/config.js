import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrs92CJylY3qZ094iIZxZwnoqO3M5Kk40",
  authDomain: "rctws-27e50.firebaseapp.com",
  databaseURL: "https://rctws-27e50-default-rtdb.firebaseio.com",
  projectId: "rctws-27e50",
  storageBucket: "rctws-27e50.firebasestorage.app",
  messagingSenderId: "433550815317",
  appId: "1:433550815317:web:2c78de0701a6a1854ea4dc",
  measurementId: "G-BRWTM4W9ZF"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export default app;
