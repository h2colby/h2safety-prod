import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config should be in .env.local
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const addSignup = async (data: {
  name: string;
  email: string;
  company: string;
  build: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, "signup"), data);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error };
  }
}; 