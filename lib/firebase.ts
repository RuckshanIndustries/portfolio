// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let db;

try {
  const allConfigPresent = Object.values(firebaseConfig).every(
    (value) => !!value
  );
  if (allConfigPresent) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    console.error("Missing Firebase configuration values");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

export { db };
