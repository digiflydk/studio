
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "digifly-landing",
  appId: "1:838217944647:web:51c1861c93e104dba76b62",
  storageBucket: "digifly-landing.appspot.com",
  apiKey: "AIzaSyB0phMKggsc9uyk1pC5q7IoJsvdaZWeGho",
  authDomain: "digifly-landing.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "838217944647"
};

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { db, storage };
