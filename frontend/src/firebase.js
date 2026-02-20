// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD4NuABBO7vQwSJqeTDfDrb7uu9lVMg5V0",
  authDomain: "trade-on-96ec3.firebaseapp.com",
  projectId: "trade-on-96ec3",
  storageBucket: "trade-on-96ec3.appspot.com",
  messagingSenderId: "268518445630",
  appId: "1:268518445630:web:20d3e227ba02431aa0776f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
