// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBatLMf3rFVQ5HuyWrD_TojCgGdbsVdJrg",
  authDomain: "tradedashborad.firebaseapp.com",
  projectId: "tradedashborad",
  storageBucket: "tradedashborad.firebasestorage.app",
  messagingSenderId: "651139308180",
  appId: "1:651139308180:web:e90d9c442648925a727281",
  measurementId: "G-102GG5PQQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export default app;