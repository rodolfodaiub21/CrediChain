// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCR1387rRNDa0DR4gI6ekTvNSPb2bVJrMig",
  authDomain: "credichain-29258.firebaseapp.com",
  projectId: "credichain-29258",
  storageBucket: "credichain-29258.appspot.com",
  messagingSenderId: "504938256248",
  appId: "1:504938256248:web:7b45bd5493eeb95149da8d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
