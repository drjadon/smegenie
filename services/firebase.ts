import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * SMEGenie Firebase Configuration
 * Project: smegenie-c5bb5
 */
const firebaseConfig = {
  apiKey: "AIzaSyByuIq-stK0EBsjZ06xqQavYTXVa1ALgFk",
  authDomain: "smegenie-c5bb5.firebaseapp.com",
  projectId: "smegenie-c5bb5",
  storageBucket: "smegenie-c5bb5.firebasestorage.app",
  messagingSenderId: "482162855692",
  appId: "1:482162855692:web:4fa070f44411a8b8738329",
  measurementId: "G-SJSBV4ZGW6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);