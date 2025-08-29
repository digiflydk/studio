
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "digifly-landing",
  appId: "1:838217944647:web:51c1861c93e104dba76b62",
  storageBucket: "digifly-landing.appspot.com",
  apiKey: "AIzaSyB0phMKggsc9uyk1pC5q7IoJsvdaZWeGho",
  authDomain: "digifly-landing.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "838217944647"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
