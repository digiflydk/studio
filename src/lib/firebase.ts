
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "digifly-landing",
  appId: "1:838217944647:web:51c1861c93e104dba76b62",
  storageBucket: "digifly-landing.firebasestorage.app",
  apiKey: "AIzaSyB0phMKggsc9uyk1pC5q7IoJsvdaZWeGho",
  authDomain: "digifly-landing.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "838217944647"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);

export { db };
